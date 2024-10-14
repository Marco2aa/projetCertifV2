<?php
// src/Command/AddCryptoProductsCommand.php
namespace App\Command;

use App\Repository\CryptoRepository;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Stripe\Product;
use Stripe\Price;
use Stripe\Exception\ApiErrorException;

#[AsCommand(name: 'app:add-products-stripe',)]
class AddCryptoProductsCommand extends Command
{


    private $cryptoRepo;

    public function __construct(CryptoRepository $cryptoRepo)
    {
        parent::__construct();
        $this->cryptoRepo = $cryptoRepo;
    }

    protected function configure()
    {
        $this
            ->setDescription('Adds cryptocurrencies to Stripe products.')
            ->setHelp('This command allows you to add cryptocurrencies to Stripe products.');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        \Stripe\Stripe::setApiKey('sk_test_51PCKdwJY5Z1qjO57uVjIzHduLdHEMHSg6M6juDc7aDBoOypPJAmnfkWzjmmtwa9JNN94LPVACDwX8yzD90hcJZe700jZYfc6qu');

        $cryptos = $this->cryptoRepo->findAll();

        try {

            foreach ($cryptos as $crypto) {
                $current_price = $crypto->getCurrentPrice();
                $unitAmountCents = round($current_price * 100);
                $product = Product::create([
                    'name' => $crypto->getName(),
                    'type' => 'service',
                    'images' => [$crypto->getImage()]
                ]);


                Price::create([
                    'product' => $product->id,
                    'unit_amount' => $unitAmountCents,
                    'currency' => 'eur',
                ]);

                $output->writeln('Crypto added: ' . $crypto->getName());
            }

            $output->writeln('All cryptocurrencies added to Stripe.');
        } catch (ApiErrorException $e) {
            $output->writeln('Error adding cryptocurrencies to Stripe: ' . $e->getMessage());
            return Command::FAILURE;
        }

        return Command::SUCCESS;
    }
}
