<?php

// src/Command/CreateUserCommand.php

namespace App\Command;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

#[AsCommand(name: 'app:create-user')]
class CreateUserCommand extends Command
{
    private $httpClient;
    private $entityManager;
    private $chiffreur;

    public function __construct(HttpClientInterface $httpClient,
                                EntityManagerInterface $entityManager,
                                UserPasswordHasherInterface $chiffreur)
    {
        $this->httpClient = $httpClient;
        $this->entityManager = $entityManager;
        $this->chiffreur = $chiffreur;

        parent::__construct();
    }

    protected function configure()
    {
        $this->setDescription('User Created');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $user = new User();
   
        $user->setEmail('marco@marco.fr');
        $motdepasse = $this->chiffreur->hashPassword($user, 'marcopiqueur'); 
        $user->setPassword($motdepasse);
        $user->setRoles(['ROLE_SUPER_ADMIN']);

        $this->entityManager->persist($user); 
        $this->entityManager->flush();

        $output->writeln('User successfully created.');

        return Command::SUCCESS;
    }
}
