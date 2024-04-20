<?php

namespace App\Repository;

use App\Entity\PriceData;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<PriceData>
 *
 * @method PriceData|null find($id, $lockMode = null, $lockVersion = null)
 * @method PriceData|null findOneBy(array $criteria, array $orderBy = null)
 * @method PriceData[]    findAll()
 * @method PriceData[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PriceDataRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, PriceData::class);
    }

    //    /**
    //     * @return PriceData[] Returns an array of PriceData objects
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

    //    public function findOneBySomeField($value): ?PriceData
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
