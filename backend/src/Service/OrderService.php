<?php

// src/Service/OrderService.php

namespace App\Service;

use App\Entity\Order;
use App\Repository\DeviseRepository;
use App\Repository\OrderRepository;
use App\Repository\WalletRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\SerializerInterface;

class OrderService
{
    private $entityManager;
    private $walletRepository;
    private $deviseRepository;
    private $orderRepository;
    private $serializer;

    public function __construct(
        EntityManagerInterface $entityManager,
        WalletRepository $walletRepository,
        DeviseRepository $deviseRepository,
        OrderRepository $orderRepository,
        SerializerInterface $serializer
    ) {
        $this->entityManager = $entityManager;
        $this->walletRepository = $walletRepository;
        $this->deviseRepository = $deviseRepository;
        $this->orderRepository = $orderRepository;
        $this->serializer = $serializer;
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

    public function getOrderDetails()
    {

        $orders = $this->orderRepository->findAll();
        $response = [];


        foreach ($orders as $order) {

            $serializedWallet = $this->serializer->serialize($order->getWallet(), 'json', ['attributes' => ['name', 'id']]);
            $serializedDevise = $this->serializer->serialize($order->getDevise(), 'json', ['attributes' => ['name', 'valeur', 'id']]);
            $serializedStripe = $this->serializer->serialize($order->getStripe(), 'json', ['attributes' => ['receipt_url']]);

            $response[] = [
                '@type' => 'Order',
                'id' => $order->getId(),
                'type' => $order->getType(),
                'quantity' => $order->getQuantity(),
                'createdAt' => $order->getCreatedAt()->format('Y-m-d\TH:i:sP'),
                'wallet' => json_decode($serializedWallet, true),
                'devise' => json_decode($serializedDevise, true),
                'stripe' => json_decode($serializedStripe, true)
            ];
        }
        return $response;
    }
}
