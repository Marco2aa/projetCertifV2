<?php

// src/Command/UpdateCategorieDataCommand.php

namespace App\Command;

use App\Entity\Categorie;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

#[AsCommand(name: 'app:update-categorie-data')]
class UpdateCategorieDataCommand extends Command
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
        $this->setDescription('Update categorie data in the database');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $count = 0;
        $api_key = "CG-gDHAm9CSTV5ATdZaHa7Xx7JS";
        $response = $this->httpClient->request(
            'GET',
            'https://api.coingecko.com/api/v3/coins/categories',
            [
                'headers' => [
                    'x-cg-demo-api-key' => $api_key,
                ],
            ]
        );
        $categories = $response->toArray();

        foreach ($categories as $categorieData) {
            
            $categorie = new Categorie();
            $categorie->setIdentifiant($categorieData['id']);
            $categorie->setName($categorieData['name']);
            if (isset($categorieData['market_cap'])) {
                $categorie->setMarketCap($categorieData['market_cap']);
            }
            if (isset($categorieData['market_cap_change_24h'])) {
                $categorie->setMarketCapChange24h($categorieData['market_cap_change_24h']);
            }
            $categorie->setTop3Coins($categorieData['top_3_coins']);
            if (isset($categorieData['volume_24h'])) {
                $categorie->setVolume24h($categorieData['volume_24h']);
            }
            if (isset($categorieData['updated_at'])) {
                $categorie->setUpdatedAt($categorieData['updated_at']);
            }
            $count += 1 ;
            $output->writeln('Category created'.$count);
            $this->entityManager->persist($categorie);
            
        }

        $this->entityManager->flush();
        $output->writeln('Categorie data updated successfully.');

        


        return Command::SUCCESS;
    }
}
