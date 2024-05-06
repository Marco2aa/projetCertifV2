<?php

namespace App\Repository;

use App\Entity\ProduitStripe;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ProduitStripe>
 *
 * @method ProduitStripe|null find($id, $lockMode = null, $lockVersion = null)
 * @method ProduitStripe|null findOneBy(array $criteria, array $orderBy = null)
 * @method ProduitStripe[]    findAll()
 * @method ProduitStripe[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ProduitStripeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ProduitStripe::class);
    }

    //    /**
    //     * @return ProduitStripe[] Returns an array of ProduitStripe objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('p.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?ProduitStripe
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
