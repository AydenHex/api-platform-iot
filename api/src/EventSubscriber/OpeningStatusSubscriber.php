<?php

namespace App\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\KernelEvents;
use ApiPlatform\Core\EventListener\EventPriorities;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Opening;
use App\Entity\Link;
use App\Entity\Heater;
use App\Repository\LinkRepository;
use App\Repository\HeaterRepository;

class OpeningStatusSubscriber implements EventSubscriberInterface
{
    private $entityManager;
    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['getHeaters', EventPriorities::POST_WRITE],
        ];
    }

    public function getHeaters(ViewEvent $event){
        $opening = $event->getControllerResult();
        if($opening instanceof Opening){
            $linkRepo = $this->entityManager->getRepository(Link::class);
            $openRepo = $this->entityManager->getRepository(Opening::class);
            $heatRepo = $this->entityManager->getRepository(Heater::class);
            $heatersLinked = $linkRepo->findBy(['adressOpening' => $opening->getAdress64()]);
            foreach($heatersLinked as $heaterLink){
                $linkedOpening = $linkRepo->findBy(['adressHeater' => $heaterLink->getAdressHeater()]);
                $finalValue = true;
                foreach($linkedOpening as $openLink){
                    $opening = $openRepo->findOneBy(['adress64' => $openLink->getAdressOpening()]);
                    if($opening->getOpened() == true){
                        $finalValue = false;
                    }
                }
                $heater = $heatRepo->findOneBy(['adress64' => $heaterLink->getAdressHeater()]);
                $heater->setStatusOn($finalValue);   
            }
            $this->entityManager->flush();
        }
    }
}
