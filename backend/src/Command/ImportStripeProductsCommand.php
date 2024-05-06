<?php


// src/Command/ImportStripeProductsCommand.php
namespace App\Command;

use App\Entity\Product;
use App\Entity\ProduitStripe;
use App\Repository\CryptoRepository;
use Doctrine\ORM\EntityManagerInterface;
use Stripe\Stripe;
use Stripe\Product as StripeProduct;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(name: 'app:import-stripe-products')]
class ImportStripeProductsCommand extends Command
{

    private $entityManager;
    private $cryptoRepository;

    public function __construct(EntityManagerInterface $entityManager, CryptoRepository $cryptoRepository)
    {
        $this->entityManager = $entityManager;
        $this->cryptoRepository = $cryptoRepository;
        parent::__construct();
    }

    protected function configure()
    {
        $this->setDescription('Import Stripe products into the database');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        // Initialize Stripe with your API key
        Stripe::setApiKey('sk_test_51PCKdwJY5Z1qjO57uVjIzHduLdHEMHSg6M6juDc7aDBoOypPJAmnfkWzjmmtwa9JNN94LPVACDwX8yzD90hcJZe700jZYfc6qu');

        // Fetch all products from Stripe
        $stripeProducts = \Stripe\Product::all(['limit' => 100]);
        print_r($stripeProducts);

        // Loop through each product and save it to the database
        foreach ($stripeProducts as $stripeProduct) {
            // Retrieve the corresponding Crypto entity
            $crypto = $this->cryptoRepository->findOneBy(['name' => $stripeProduct['name']]);

            if ($crypto) {
                // Create a new Product entity
                $product = new ProduitStripe();
                $product->setProduitId($stripeProduct['id']);
                $product->setName($stripeProduct['name']);
                // Set other product properties as needed
                $product->setCrypto($crypto);
                // Associate the Product with the Crypto


                // Persist the Product entity
                $this->entityManager->persist($product);
            }
        }

        // Flush changes to the database
        $this->entityManager->flush();

        $output->writeln('Stripe products imported successfully.');

        return Command::SUCCESS;
    }
}
