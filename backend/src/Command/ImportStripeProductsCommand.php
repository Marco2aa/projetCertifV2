<?php


// src/Command/ImportStripeProductsCommand.php
namespace App\Command;

use App\Entity\Product;
use App\Entity\ProduitStripe;
use App\Repository\CryptoRepository;
use App\Repository\ProduitStripeRepository;
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
    private $produitStripeRepository;

    public function __construct(EntityManagerInterface $entityManager, CryptoRepository $cryptoRepository, ProduitStripeRepository $produitStripeRepository)
    {
        $this->entityManager = $entityManager;
        $this->cryptoRepository = $cryptoRepository;
        $this->produitStripeRepository = $produitStripeRepository;
        parent::__construct();
    }

    protected function configure()
    {
        $this->setDescription('Import Stripe products into the database');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        // Initialize Stripe with your API key
        Stripe::setApiKey('sk_test_51Ovg9SK0rs45oKLry2Bm17nxBsh886BTtFXwPXjU91aiuuFs6M8osIjFEq5E4oCNdV42hZuufGzWsdsNfLdr0rL300eHmQCd2D');

        // Supprimer toutes les entrées existantes dans la table produit_stripe
        $this->entityManager->createQuery('DELETE FROM App\Entity\ProduitStripe p')->execute();

        $output->writeln('Toutes les entrées de ProduitStripe ont été supprimées.');

        // Récupérer le nombre d'entrées dans la table Crypto
        $cryptoCount = $this->cryptoRepository->createQueryBuilder('c')
            ->select('COUNT(c.id)')
            ->getQuery()
            ->getSingleScalarResult();

        $output->writeln('Nombre de cryptomonnaies dans la base de données : ' . $cryptoCount);

        // Pagination de l'API Stripe pour récupérer seulement le nombre exact de produits correspondant aux cryptos
        $stripeProducts = [];
        $hasMore = true;
        $lastProductId = null;
        $productsRetrieved = 0; // Compteur pour suivre le nombre total de produits récupérés

        while ($hasMore && $productsRetrieved < $cryptoCount) {
            // Calculer combien de produits il reste à récupérer
            $remainingProducts = $cryptoCount - $productsRetrieved;

            // Récupérer jusqu'à 100 produits ou moins si on a besoin de moins de 100
            $limit = min($remainingProducts, 100);

            $params = ['limit' => $limit];
            if ($lastProductId) {
                $params['starting_after'] = $lastProductId;
            }

            $response = \Stripe\Product::all($params);
            $stripeProducts = array_merge($stripeProducts, $response->data);

            // Met à jour le nombre total de produits récupérés
            $productsRetrieved += count($response->data);

            // Vérifie s'il y a d'autres pages et met à jour `lastProductId`
            $hasMore = $response->has_more;
            if ($hasMore) {
                $lastProductId = end($response->data)->id; // Dernier ID de la page courante
            }
        }

        $output->writeln('Total des produits Stripe récupérés : ' . count($stripeProducts));

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

                $this->entityManager->persist($product);
            }
        }

        // Flush all changes to the database
        $this->entityManager->flush();

        $output->writeln('Produits Stripe importés avec succès.');

        return Command::SUCCESS;
    }
}
