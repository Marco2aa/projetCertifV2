<?php

// src/Service/OrderService.php

namespace App\Service;

use App\Entity\Order;
use App\Repository\DeviseRepository;
use App\Repository\WalletRepository;
use Doctrine\ORM\EntityManagerInterface;

class OrderService
{
    private $entityManager;
    private $walletRepository;
    private $deviseRepository;

    public function __construct(
        EntityManagerInterface $entityManager,
        WalletRepository $walletRepository,
        DeviseRepository $deviseRepository
    ) {
        $this->entityManager = $entityManager;
        $this->walletRepository = $walletRepository;
        $this->deviseRepository = $deviseRepository;
    }

    public function createDepositOrder(string $type, float $quantity, \DateTimeImmutable $createdAt, $walletId, $deviseId = null, $stripe = null)
    {

        $wallet = $this->walletRepository->find($walletId);
        if ($deviseId) {
            $devise = $this->deviseRepository->find($deviseId);
        } else {
            $devise = null;
        }


        $order = new Order();
        $order->setType($type);
        $order->setQuantity($quantity);
        $order->setCreatedAt($createdAt);
        $order->setWallet($wallet);
        $order->setDevise($devise);
        $order->setStripe($stripe);



        $this->entityManager->persist($order);
        $this->entityManager->flush();

        return $order;
    }
}
