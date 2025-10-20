<?php

declare(strict_types=1);

namespace App;

use Symfony\Bundle\FrameworkBundle\Kernel\MicroKernelTrait;
use Symfony\Component\HttpKernel\Kernel as BaseKernel;

class Kernel extends BaseKernel
{
    use MicroKernelTrait;

    public function boot(): void
    {
        parent::boot();

        // Set default locale
        $defaultLocale = $this->getContainer()->getParameter('app.default_locale');
        if ($defaultLocale) {
            \Locale::setDefault($defaultLocale);
            $this->getContainer()->get('request_stack')->getCurrentRequest()?->setLocale($defaultLocale);
        }

        // Set default timezone
        $defaultTimezone = $this->getContainer()->getParameter('app.default_timezone');
        if ($defaultTimezone) {
            date_default_timezone_set($defaultTimezone);
        }
    }
}
