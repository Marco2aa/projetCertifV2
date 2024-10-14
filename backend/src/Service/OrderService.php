<?php

// src/Service/OrderService.php

namespace App\Service;

use App\Entity\Order;
use App\Entity\User;
use App\Repository\DeviseRepository;
use App\Repository\OrderRepository;
use App\Repository\UserRepository;
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
    private $userRepository;
    private $serializer;

    public function __construct(
        EntityManagerInterface $entityManager,
        UserRepository $userRepository,
        WalletRepository $walletRepository,
        DeviseRepository $deviseRepository,
        OrderRepository $orderRepository,
        SerializerInterface $serializer
    ) {
        $this->entityManager = $entityManager;
        $this->walletRepository = $walletRepository;
        $this->deviseRepository = $deviseRepository;
        $this->orderRepository = $orderRepository;
        $this->userRepository = $userRepository;
        $this->serializer = $serializer;
    }

    public function createDepositOrder(string $type, float $quantity, \DateTimeImmutable $createdAt, $walletId, $userId, $deviseId = null, $stripe = null)
    {
        $wallet = $this->walletRepository->find($walletId);
        $user = $this->userRepository->find($userId); // Récupérer l'utilisateur
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
        $order->setUser($user); // Associer l'utilisateur à l'ordre

        $this->entityManager->persist($order);
        $this->entityManager->flush();

        return $order;
    }


    public function getOrderDetails(User $user)
    {
        $orders = $this->orderRepository->findByUser($user);
        $response = [];

        foreach ($orders as $order) {

            $serializedWallet = $this->serializer->serialize($order->getWallet(), 'json', ['attributes' => ['name', 'id']]);
            $serializedDevise = $this->serializer->serialize($order->getDevise(), 'json', ['attributes' => ['name', 'valeur', 'id']]);
            $serializedStripe = $this->serializer->serialize($order->getStripe(), 'json', ['attributes' => ['receipt_url']]);
            $serializedUser = $this->serializer->serialize($order->getUser(), 'json', ['attributes' => ['email', 'nom', 'prenom']]);

            $response[] = [
                '@type' => 'Order',
                'id' => $order->getId(),
                'type' => $order->getType(),
                'quantity' => $order->getQuantity(),
                'createdAt' => $order->getCreatedAt()->format('Y-m-d\TH:i:sP'),
                'wallet' => json_decode($serializedWallet, true),
                'devise' => json_decode($serializedDevise, true),
                'stripe' => json_decode($serializedStripe, true),
                'user' => json_decode($serializedUser, true)
            ];
        }

        return $response;  // Retourne la réponse assemblée en tableau associatif
    }
}
