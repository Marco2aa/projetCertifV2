<?php

namespace App\Service;

use App\Repository\OrderRepository;
use App\Repository\CryptoRepository;
use App\Entity\User;

class CryptoService
{
    private $orderRepository;
    private $cryptoRepository;

    public function __construct(OrderRepository $orderRepository, CryptoRepository $cryptoRepository)
    {
        $this->orderRepository = $orderRepository;
        $this->cryptoRepository = $cryptoRepository;
    }


    public function calculateUserCryptoBalance(User $user, int $cryptoId): float
    {
        // Récupérer les ordres d'achat et de vente de l'utilisateur pour la crypto donnée
        $buyOrders = $this->orderRepository->findBy([
            'user' => $user,
            'crypto' => $cryptoId,
            'type' => 'Achat',
        ]);

        $sellOrders = $this->orderRepository->findBy([
            'user' => $user,
            'crypto' => $cryptoId,
            'type' => 'Vente',
        ]);

        // Calculer la quantité totale achetée
        $totalBought = 0;
        foreach ($buyOrders as $order) {
            $totalBought += $order->getQuantity();
        }

        // Calculer la quantité totale vendue
        $totalSold = 0;
        foreach ($sellOrders as $order) {
            $totalSold += $order->getQuantity();
        }

        // Retourner la quantité nette possédée (acheté - vendu)
        return max(0, $totalBought - $totalSold);
    }

    public function calculateFiatBalance(User $user): float
    {
        // Récupérer les ordres de dépôt et de retrait de l'utilisateur
        $depositOrders = $this->orderRepository->findBy([
            'user' => $user,
            'type' => 'Depot',
        ]);

        $withdrawOrders = $this->orderRepository->findBy([
            'user' => $user,
            'type' => 'Retrait',
        ]);

        // Calculer la somme totale des dépôts
        $totalDeposited = 0;
        foreach ($depositOrders as $order) {
            $totalDeposited += $order->getQuantity(); // Le montant en euros déposé
        }

        // Calculer la somme totale des retraits
        $totalWithdrawn = 0;
        foreach ($withdrawOrders as $order) {
            $totalWithdrawn += $order->getQuantity(); // Le montant en euros retiré
        }

        // Calculer le solde fiat net (dépôts - retraits)
        return max(0, $totalDeposited - $totalWithdrawn);
    }

    public function getUserCryptosInWallet(User $user, int $walletId): array
    {
        // Récupérer tous les ordres (achat/vente) de l'utilisateur pour un wallet donné
        $orders = $this->orderRepository->findBy(['user' => $user, 'wallet' => $walletId]);

        $cryptoBalances = [];

        foreach ($orders as $order) {
            // Vérifier si l'ordre a une crypto associée
            $crypto = $order->getCrypto();
            if ($crypto === null) {
                // Optionnel : Ajouter une logique ici si tu veux gérer les ordres sans cryptos
                continue; // Sauter cet ordre s'il n'a pas de crypto
            }

            $cryptoId = $crypto->getId();
            $quantity = $order->getQuantity();

            if (!isset($cryptoBalances[$cryptoId])) {
                $cryptoBalances[$cryptoId] = 0;
            }

            // Si c'est un achat, on augmente le solde, si c'est une vente, on le diminue
            if ($order->getType() === 'Achat') {
                $cryptoBalances[$cryptoId] += $quantity;
            } elseif ($order->getType() === 'Vente') {
                $cryptoBalances[$cryptoId] -= $quantity;
            }
        }

        // Filtrer pour ne garder que les cryptos avec un solde positif
        $cryptosWithBalance = array_filter($cryptoBalances, fn($balance) => $balance > 0);

        // Retourner un tableau avec les cryptos et leur quantité
        return $cryptosWithBalance;
    }
}
