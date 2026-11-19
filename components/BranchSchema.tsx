import React from 'react';

export default function BranchSchema() {
  const schemaData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://khaturidescg.in/#organization',
        name: 'Khatu Rides Travels Co.',
        url: 'https://khaturidescg.in/',
        logo: 'https://khaturidescg.in/logo.png',
        email: 'khaturides@gmail.com',
      },
      {
        '@type': 'TaxiService',
        '@id': 'https://khaturidescg.in/#korba-branch',
        name: 'Khatu Rides Travels Co. - Korba',
        parentOrganization: {
          '@id': 'https://khaturidescg.in/#organization',
        },
        url: 'https://khaturidescg.in/',
        telephone: '+91-9893694232',
        priceRange: '₹₹',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Bus Stand Road',
          addressLocality: 'Korba',
          addressRegion: 'Chhattisgarh',
          postalCode: '495678',
          addressCountry: 'IN',
        },
        areaServed: [
          'Korba',
          'Raigarh',
          'Bilaspur',
          'Raipur',
          'Ambikapur',
          'Ranchi',
          'Jharsuguda',
        ],
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ],
          opens: '00:00',
          closes: '23:59',
        },
      },
      {
        '@type': 'TaxiService',
        '@id': 'https://khaturidescg.in/#raipur-branch',
        name: 'Khatu Rides Travels Co. - Raipur',
        parentOrganization: {
          '@id': 'https://khaturidescg.in/#organization',
        },
        url: 'https://khaturidescg.in/',
        telephone: '+91-9244137353',
        priceRange: '₹₹',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Near Mana Camp, Swami Vivekanand Airport Road', 
          addressLocality: 'Raipur',
          addressRegion: 'Chhattisgarh',
          postalCode: '492015',
          addressCountry: 'IN',
        },
        areaServed: [
          'Raipur',
          'Swami Vivekananda Airport Raipur',
          'Durg',
          'Bhilai',
          'Bilaspur',
          'Korba',
        ],
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ],
          opens: '00:00',
          closes: '23:59',
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}