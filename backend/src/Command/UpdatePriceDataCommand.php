<?php

// src/Command/UpdatePriceDataCommand.php

namespace App\Command;

use App\Entity\Crypto;
use App\Entity\PriceData;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

#[AsCommand(name: 'app:update-price-data')]
class UpdatePriceDataCommand extends Command
{
    private $httpClient;
    private $entityManager;

    public function __construct(HttpClientInterface $httpClient, EntityManagerInterface $entityManager)
    {
        $this->httpClient = $httpClient;
        $this->entityManager = $entityManager;

        parent::__construct();
    }

    protected function configure()
    {
        $this->setDescription('Update historical data in the database');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $this->entityManager->createQuery('DELETE FROM App\Entity\PriceData')->execute();
        
        $response = $this->httpClient->request(
            'GET',
            'https://api.coingecko.com/api/v3/coins/markets?vs_currency=EUR&order=market_cap_desc&per_page=30&page=1&sparkline=false'
        );
        $cryptos = $response->toArray();

        $periods = [1,7, 30, 90];
        $count1 = 0;
        $count = 0;
        foreach($periods as $period){
            foreach ($cryptos as $cryptoData) {
                
                $crypto = $this->entityManager->getRepository(Crypto::class)->findOneBy(['name' => $cryptoData['name']]);
                
                $response = $this->httpClient->request(
                    'GET',
                    'https://api.coingecko.com/api/v3/coins/'.strtolower($cryptoData['id']).'/market_chart?vs_currency=EUR&days='.$period
                );
                $count +=1 ;
                $output->writeln('request_done'.$count);
                $price_data = $response->toArray();
                foreach ($price_data['prices'] as $data) {
                    $priceEntity = new PriceData();
                    $priceEntity->setTimestamp(new \DateTime('@'.$data[0] / 1000));
                    $priceEntity->setPrice($data[1]);
                    $priceEntity->setGranularity($period);
                    $priceEntity->setCrypto($crypto);
                    $this->entityManager->persist($priceEntity);
                    $count1 += 1;
                    $output->writeln('price added'.$count1);
                    $this->entityManager->flush();
                }
                usleep(20000000); //Permet de contourner ma limite de 30 appels/minutes.
                

                
            }
        }
            
        


        $output->writeln('Crypto data updated successfully.');

        return Command::SUCCESS;
    }
}
