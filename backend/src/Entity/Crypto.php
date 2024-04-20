<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\CryptoRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\BigIntType;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CryptoRepository::class)]
#[ApiResource]
class Crypto
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $symbol = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $image = null;

    #[ORM\Column]
    private ?float $current_price = null;

    #[ORM\Column]
    private ?float $market_cap = null;

    #[ORM\Column]
    private ?float $market_cap_rank = null;

    #[ORM\Column(nullable: true)]
    private ?float $total_volume = null;

    #[ORM\Column(nullable: true)]
    private ?float $high_24h = null;

    #[ORM\Column(nullable: true)]
    private ?float $low_24h = null;

    #[ORM\Column(nullable: true)]
    private ?float $price_change_24h = null;

    #[ORM\Column(nullable: true)]
    private ?float $price_change_percentage_24h = null;

    #[ORM\Column(nullable: true)]
    private ?float $market_cap_change_24h = null;

    #[ORM\Column(nullable: true)]
    private ?float $market_cap_change_percentage_24h = null;

    #[ORM\Column(nullable: true)]
    private ?float $circulating_supply = null;

    #[ORM\Column(nullable: true)]
    private ?float $total_supply = null;

    #[ORM\Column(nullable: true)]
    private ?float $max_supply = null;

    #[ORM\Column(nullable: true)]
    private ?float $ath = null;

    #[ORM\Column(nullable: true)]
    private ?float $ath_change_percentage = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $ath_date = null;

    #[ORM\Column(nullable: true)]
    private ?float $atl = null;

    #[ORM\Column(nullable: true)]
    private ?float $atl_change_percentage = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $atl_date = null;

    /**
     * @var Collection<int, PriceData>
     */
    #[ORM\OneToMany(targetEntity: PriceData::class, mappedBy: 'crypto')]
    private Collection $priceData;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $idenitifiant = null;

    public function __construct()
    {
        $this->priceData = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSymbol(): ?string
    {
        return $this->symbol;
    }

    public function setSymbol(string $symbol): static
    {
        $this->symbol = $symbol;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getImage(): ?string
    {
        return $this->image;
    }

    public function setImage(?string $image): static
    {
        $this->image = $image;

        return $this;
    }

    public function getCurrentPrice(): ?float
    {
        return $this->current_price;
    }

    public function setCurrentPrice(float $current_price): static
    {
        $this->current_price = $current_price;

        return $this;
    }

    public function getMarketCap(): ?float
    {
        return $this->market_cap;
    }

    public function setMarketCap(float $market_cap): static
    {
        $this->market_cap = $market_cap;

        return $this;
    }

    public function getMarketCapRank(): ?float
    {
        return $this->market_cap_rank;
    }

    public function setMarketCapRank(float $market_cap_rank): static
    {
        $this->market_cap_rank = $market_cap_rank;

        return $this;
    }

    public function getTotalVolume(): ?float
    {
        return $this->total_volume;
    }

    public function setTotalVolume(?float $total_volume): static
    {
        $this->total_volume = $total_volume;

        return $this;
    }

    public function getHigh24h(): ?float
    {
        return $this->high_24h;
    }

    public function setHigh24h(?float $high_24h): static
    {
        $this->high_24h = $high_24h;

        return $this;
    }

    public function getLow24h(): ?float
    {
        return $this->low_24h;
    }

    public function setLow24h(?float $low_24h): static
    {
        $this->low_24h = $low_24h;

        return $this;
    }

    public function getPriceChange24h(): ?float
    {
        return $this->price_change_24h;
    }

    public function setPriceChange24h(?float $price_change_24h): static
    {
        $this->price_change_24h = $price_change_24h;

        return $this;
    }

    public function getPriceChangePercentage24h(): ?float
    {
        return $this->price_change_percentage_24h;
    }

    public function setPriceChangePercentage24h(?float $price_change_percentage_24h): static
    {
        $this->price_change_percentage_24h = $price_change_percentage_24h;

        return $this;
    }

    public function getMarketCapChange24h(): ?float
    {
        return $this->market_cap_change_24h;
    }

    public function setMarketCapChange24h(float $market_cap_change_24h): static
    {
        $this->market_cap_change_24h = $market_cap_change_24h;

        return $this;
    }

    public function getMarketCapChangePercentage24h(): ?float
    {
        return $this->market_cap_change_percentage_24h;
    }

    public function setMarketCapChangePercentage24h(?float $market_cap_change_percentage_24h): static
    {
        $this->market_cap_change_percentage_24h = $market_cap_change_percentage_24h;

        return $this;
    }

    public function getCirculatingSupply(): ?float
    {
        return $this->circulating_supply;
    }

    public function setCirculatingSupply(?float $circulating_supply): static
    {
        $this->circulating_supply = $circulating_supply;

        return $this;
    }

    public function getTotalSupply(): ?float
    {
        return $this->total_supply;
    }

    public function setTotalSupply(?float $total_supply): static
    {
        $this->total_supply = $total_supply;

        return $this;
    }

    public function getMaxSupply(): ?float
    {
        return $this->max_supply;
    }

    public function setMaxSupply(?float $max_supply): static
    {
        $this->max_supply = $max_supply;

        return $this;
    }

    public function getAth(): ?float
    {
        return $this->ath;
    }

    public function setAth(?float $ath): static
    {
        $this->ath = $ath;

        return $this;
    }

    public function getAthChangePercentage(): ?float
    {
        return $this->ath_change_percentage;
    }

    public function setAthChangePercentage(?float $ath_change_percentage): static
    {
        $this->ath_change_percentage = $ath_change_percentage;

        return $this;
    }

    public function getAthDate(): ?\DateTimeInterface
    {
        return $this->ath_date;
    }

    public function setAthDate(?\DateTimeInterface $ath_date): static
    {
        $this->ath_date = $ath_date;

        return $this;
    }

    public function getAtl(): ?float
    {
        return $this->atl;
    }

    public function setAtl(?float $atl): static
    {
        $this->atl = $atl;

        return $this;
    }

    public function getAtlChangePercentage(): ?float
    {
        return $this->atl_change_percentage;
    }

    public function setAtlChangePercentage(?float $atl_change_percentage): static
    {
        $this->atl_change_percentage = $atl_change_percentage;

        return $this;
    }

    public function getAtlDate(): ?\DateTimeInterface
    {
        return $this->atl_date;
    }

    public function setAtlDate(?\DateTimeInterface $atl_date): static
    {
        $this->atl_date = $atl_date;

        return $this;
    }

    /**
     * @return Collection<int, PriceData>
     */
    public function getPriceData(): Collection
    {
        return $this->priceData;
    }

    public function addPriceData(PriceData $priceData): static
    {
        if (!$this->priceData->contains($priceData)) {
            $this->priceData->add($priceData);
            $priceData->setCrypto($this);
        }

        return $this;
    }

    public function removePriceData(PriceData $priceData): static
    {
        if ($this->priceData->removeElement($priceData)) {
            // set the owning side to null (unless already changed)
            if ($priceData->getCrypto() === $this) {
                $priceData->setCrypto(null);
            }
        }

        return $this;
    }

    public function getIdenitifiant(): ?string
    {
        return $this->idenitifiant;
    }

    public function setIdenitifiant(?string $idenitifiant): static
    {
        $this->idenitifiant = $idenitifiant;

        return $this;
    }
}
