<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * This is a heating/cooling element.
 * @ApiResource()
 * @ORM\Entity(repositoryClass="App\Repository\HeaterRepository")
 * @UniqueEntity("adress64")
 */
class Heater
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * The name of the heating/cooling element
     * @ORM\Column(type="string", length=30, nullable=true)
     */
    private $name;

    /**
     * The adress64 of the Xbee associated to the element.
     * @ORM\Column(type="string", length=30)
     */
    private $adress64;

    public function __construct()
    {
        $this->openings = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getAdress64(): ?string
    {
        return $this->adress64;
    }

    public function setAdress64(string $adress64): self
    {
        $this->adress64 = $adress64;

        return $this;
    }
}
