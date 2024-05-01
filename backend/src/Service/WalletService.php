<?php

// src/Service/WalletService.php

namespace App\Service;

use App\Entity\User;
use App\Entity\Wallet;
use Doctrine\ORM\EntityManagerInterface;

class WalletService
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function createWallet(User $user)
    {
        $wallet = new Wallet();
        $wallet->setUser($user);
        $wallet->setName($user->getNom());
        $wallet->setSolde(0);

        $this->entityManager->persist($wallet);
        $this->entityManager->flush();

        return $wallet;
    }

    public function updateWalletSolde(User $user, string $walletName, float $newSolde): void
    {
        $wallet = null;
        foreach ($user->getWallets() as $userWallet) {
            if ($userWallet->getName() === $walletName) {
                $wallet = $userWallet;
                break;
            }
        }
        if (!$wallet) {
            throw new \InvalidArgumentException('Portefeuille non trouvé pour le nom spécifié');
        }
        $wallet->setSolde($newSolde);
        $this->entityManager->flush();
    }
}
