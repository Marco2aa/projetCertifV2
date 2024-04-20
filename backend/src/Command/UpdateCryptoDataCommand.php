<?php

// src/Command/UpdateCryptoDataCommand.php

namespace App\Command;

use App\Entity\Crypto;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

#[AsCommand(name: 'app:update-crypto-data')]
class UpdateCryptoDataCommand extends Command
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
        $this->setDescription('Update crypto data in the database');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $this->entityManager->createQuery('DELETE FROM App\Entity\Crypto')->execute();
        
        $response = $this->httpClient->request(
            'GET',
            'https://api.coingecko.com/api/v3/coins/markets?vs_currency=EUR&order=market_cap_desc&per_page=100&page=1&sparkline=false'
        );
        $cryptos = $response->toArray();

        foreach ($cryptos as $cryptoData) {
            
            $crypto = new Crypto();
            $crypto->setIdenitifiant($cryptoData['id']);
            $crypto->setSymbol($cryptoData['symbol']);
            $crypto->setName($cryptoData['name']);
            $crypto->setImage($cryptoData['image']);
            $crypto->setCurrentPrice($cryptoData['current_price']);
            $crypto->setMarketCap($cryptoData['market_cap']);
            $crypto->setMarketCapRank($cryptoData['market_cap_rank']);
            $crypto->setTotalVolume($cryptoData['total_volume']);
            $crypto->setHigh24h($cryptoData['high_24h']);
            $crypto->setLow24h($cryptoData['low_24h']);
            $crypto->setPriceChange24h($cryptoData['price_change_24h']);
            $crypto->setPriceChangePercentage24h($cryptoData['price_change_percentage_24h']);
            $crypto->setMarketCapChange24h($cryptoData['market_cap_change_24h']);
            $crypto->setMarketCapChangePercentage24h($cryptoData['market_cap_change_percentage_24h']);
            $crypto->setCirculatingSupply($cryptoData['circulating_supply']);
            $crypto->setTotalSupply($cryptoData['total_supply']);
            $crypto->setMaxSupply($cryptoData['max_supply']);
            $crypto->setAth($cryptoData['ath']);
            $crypto->setAthChangePercentage($cryptoData['ath_change_percentage']);
            $crypto->setAthDate(new \DateTime($cryptoData['ath_date']));
            $crypto->setAtl($cryptoData['atl']);
            $crypto->setAtlChangePercentage($cryptoData['atl_change_percentage']);
            $crypto->setAtlDate(new \DateTime($cryptoData['atl_date']));

            $this->entityManager->persist($crypto);
            
        }

        $this->entityManager->flush();

        $output->writeln('Crypto data updated successfully.');

        return Command::SUCCESS;
    }
}
