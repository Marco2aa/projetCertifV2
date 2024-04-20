<?php

// src/Command/UpdateDeviseDataCommand.php

namespace App\Command;

use App\Entity\Devise;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;


#[AsCommand(name: 'app:update-devise-data')]
class UpdateDeviseDataCommand extends Command
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
        $this->setDescription('Update devise data in the database');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $apiKey = "3aa4dc90569f01aadcd7265fc5260df7";

        $response = $this->httpClient->request(
            'GET',
            'http://data.fixer.io/api/latest?access_key=' . $apiKey
        );
        $currencies = $response->toArray();

        foreach ($currencies['rates'] as $currency => $value) {
            $existingDevise = $this->entityManager->getRepository(Devise::class)->findOneBy(['nom' => $currency]);
            if (!$existingDevise) {
                $devise = new Devise();
                $devise->setNom($currency);
                $devise->setValeur($value);
                $this->entityManager->persist($devise);
            } else {
                $existingDevise->setValeur($value);
                $this->entityManager->persist($existingDevise);
            }
        }

        $this->entityManager->flush();

        $output->writeln('Devise data updated successfully.');

        return Command::SUCCESS;
    }
}
