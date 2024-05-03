<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use App\Entity\User;
use App\Entity\Wallet;
use App\Service\WalletService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserController extends AbstractController
{

    private $walletService;

    public function __construct(WalletService $walletService)
    {
        $this->walletService = $walletService;
    }


    #[Route('/api/me')]
    #[IsGranted('ROLE_USER')]
    public function me()
    {
        return $this->json($this->getUser());
    }

    #[Route(path: '/api/register', name: 'app_register', methods: ['POST'])]
    public function register(
        #[MapRequestPayload()]
        User $user,
        UserPasswordHasherInterface $hasheur,
        EntityManagerInterface $em
    ) {


        $user->setCreatedAt(new \DateTimeImmutable());
        $user->setUpdatedAt(new \DateTimeImmutable());
        $hashedPassword = $hasheur->hashPassword($user, $user->getPassword());
        $user->setPassword($hashedPassword);

        $this->walletService->createWallet($user);


        $em->persist($user);

        $em->flush();

        return $this->json($user, 201, [], [
            'groups' => ['user.show']
        ]);
    }
}
