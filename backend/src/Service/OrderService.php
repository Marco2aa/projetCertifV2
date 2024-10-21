<?php

// src/Service/OrderService.php

namespace App\Service;

use App\Entity\Order;
use App\Entity\User;
use App\Repository\CryptoRepository;
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
    private $cryptoRepository;

    public function __construct(
        EntityManagerInterface $entityManager,
        UserRepository $userRepository,
        WalletRepository $walletRepository,
        DeviseRepository $deviseRepository,
        OrderRepository $orderRepository,
        SerializerInterface $serializer,
        CryptoRepository $cryptoRepository,
    ) {
        $this->entityManager = $entityManager;
        $this->walletRepository = $walletRepository;
        $this->deviseRepository = $deviseRepository;
        $this->orderRepository = $orderRepository;
        $this->userRepository = $userRepository;
        $this->serializer = $serializer;
        $this->cryptoRepository = $cryptoRepository;
    }

    public function createDepositOrder(string $type, float $quantity, \DateTimeImmutable $createdAt, $walletId, $userId, $deviseId = null, float $deviseValue = null, float $cryptoValue = null, $stripe = null, $cryptoId = null)
    {
        $wallet = $this->walletRepository->find($walletId);
        $user = $this->userRepository->find($userId); // Récupérer l'utilisateur
        if ($deviseId) {
            $devise = $this->deviseRepository->find($deviseId);
        } else {
            $devise = null;
        }

        if ($cryptoId) {
            $crypto = $this->cryptoRepository->find($cryptoId);
        } else {
            $crypto = null;
        }

        $order = new Order();
        $order->setType($type);
        $order->setQuantity($quantity);
        $order->setCreatedAt($createdAt);
        $order->setWallet($wallet);
        $order->setDevise($devise);
        $order->setStripe($stripe);
        $order->setUser($user); // Associer l'utilisateur à l'ordre
        $order->setCrypto($crypto);

        // Ajouter la valeur de la devise et de la crypto au moment de l'ordre
        if ($deviseValue !== null) {
            $order->setDeviseValue($deviseValue);
        }
        if ($cryptoValue !== null) {
            $order->setCryptoPriceAtTransaction($cryptoValue); // Utiliser la méthode déjà mise en place
        }

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
            // Récupérer le prix de la crypto et la valeur de la devise au moment de la transaction
            $cryptoPriceAtTransaction = $order->getCryptoPriceAtTransaction();
            $deviseValue = $order->getDeviseValue();
            $response[] = [
                '@type' => 'Order',
                'id' => $order->getId(),
                'type' => $order->getType(),
                'quantity' => $order->getQuantity(),
                'createdAt' => $order->getCreatedAt()->format('Y-m-d\TH:i:sP'),
                'wallet' => json_decode($serializedWallet, true),
                'devise' => json_decode($serializedDevise, true),
                'stripe' => json_decode($serializedStripe, true),
                'user' => json_decode($serializedUser, true),
                'cryptoPriceAtTransaction' => $cryptoPriceAtTransaction ? $cryptoPriceAtTransaction : null, // Inclure le prix de la crypto
                'deviseValue' => $deviseValue ? $deviseValue : null // Inclure la valeur de la devise
            ];
        }
        return $response;
    }

    public function getUserOrdersWithDates(User $user): array
    {
        $orders = $this->orderRepository->findBy(['user' => $user], ['createdAt' => 'ASC']);
        $ordersData = [];

        foreach ($orders as $order) {
            $crypto = $order->getCrypto();

            // Vérifier que l'ordre a bien une crypto associée
            if ($crypto) {
                $ordersData[] = [
                    'cryptoId' => $crypto->getSymbol(),
                    'type' => $order->getType(),
                    'quantity' => $order->getQuantity(),
                    'createdAt' => $order->getCreatedAt(),
                    'cryptoPriceAtOrder' => $order->getCryptoPriceAtTransaction(), // Ajout du prix au moment de l'ordre
                ];
            }
        }

        return $ordersData;
    }
}
