const siteConfig = {
  storageAvailabilityStatus: 'full', // change to: 'available' or 'full'
  parkingAvailabilityStatus: 'available', // change to: 'available' or 'full'
  availableUnitsCount: 0,
  availableParkingCount: 10,
  tenantCloudUrl: '#', // paste your TenantCloud booking link here later
};

function getRequestedType() {
  const params = new URLSearchParams(window.location.search);
  return params.get('type'); // storage | parking | null
}

function applyAvailability() {
  const storageAvailable = siteConfig.storageAvailabilityStatus === 'available';
  const parkingAvailable = siteConfig.parkingAvailabilityStatus === 'available';
  const anyAvailable = storageAvailable || parkingAvailable;
  const requestedType = getRequestedType();

  const statusText = document.getElementById('statusText');
  const statusSubtext = document.getElementById('statusSubtext');
  const availabilityHeading = document.getElementById('availabilityHeading');
  const availabilityMessage = document.getElementById('availabilityMessage');
  const contactStatusHeading = document.getElementById('contactStatusHeading');
  const contactStatusMessage = document.getElementById('contactStatusMessage');
  const contactPageTitle = document.getElementById('contactPageTitle');
  const contactPageIntro = document.getElementById('contactPageIntro');
  const waitlistInterest = document.getElementById('waitlistInterest');

  const rentButtons = [
    document.getElementById('rentNowBtn'),
    document.getElementById('contactRentBtn')
  ].filter(Boolean);

  const getSummaryHeading = () => {
    if (storageAvailable && parkingAvailable) return 'Units and Parking Available';
    if (storageAvailable && !parkingAvailable) return 'Storage Units Available';
    if (!storageAvailable && parkingAvailable) return 'Parking Available Now';
    return 'Currently Full';
  };

  const getSummarySubtext = () => {
    if (storageAvailable && parkingAvailable) {
      return 'Storage units and parking spaces are available now. Call or text 208-650-8712 to rent quickly.';
    }
    if (storageAvailable && !parkingAvailable) {
      return 'Storage units are available now. Parking is currently full.';
    }
    if (!storageAvailable && parkingAvailable) {
      return '10×20 storage units are currently full, but parking spaces are available now.';
    }
    return 'Join the waitlist and we’ll contact you when one opens.';
  };

  const getAvailabilityMessage = () => {
    if (storageAvailable && parkingAvailable) {
      return `We currently have ${siteConfig.availableUnitsCount || 'some'} storage unit${siteConfig.availableUnitsCount === 1 ? '' : 's'} available and ${siteConfig.availableParkingCount || 'some'} parking space${siteConfig.availableParkingCount === 1 ? '' : 's'} available. Call, text, or rent online now.`;
    }
    if (storageAvailable && !parkingAvailable) {
      return `We currently have ${siteConfig.availableUnitsCount || 'some'} storage unit${siteConfig.availableUnitsCount === 1 ? '' : 's'} available. Parking is currently full. Call or text now to rent quickly.`;
    }
    if (!storageAvailable && parkingAvailable) {
      return `10×20 storage units are currently full, but we have ${siteConfig.availableParkingCount || 'some'} parking space${siteConfig.availableParkingCount === 1 ? '' : 's'} available now. Call or text to rent parking, or join the waitlist for a storage unit.`;
    }
    return 'Units at Backroad Storage go fast. Join the waitlist now and we’ll reach out when a 10×20 unit or parking space opens up.';
  };

  const getContactView = () => {
    if (requestedType === 'storage') {
      return {
        pageTitle: 'Storage unit availability',
        pageIntro: 'See the current status for 10×20 storage units, then call, text, or join the waitlist below.',
        statusHeading: storageAvailable ? 'Storage Units Available' : 'Storage Units Currently Full',
        statusMessage: storageAvailable
          ? `We currently have ${siteConfig.availableUnitsCount || 'some'} 10×20 storage unit${siteConfig.availableUnitsCount === 1 ? '' : 's'} available. Call or text now to rent quickly.`
          : 'Our 10×20 storage units are currently full. Join the waitlist below and we’ll contact you as soon as one opens up.',
        showRent: storageAvailable,
        rentText: siteConfig.tenantCloudUrl !== '#' ? 'Rent Storage Unit Now' : 'Call to Rent Storage',
        waitlistValue: '10x20 Storage Unit'
      };
    }

    if (requestedType === 'parking') {
      return {
        pageTitle: 'Parking space availability',
        pageIntro: 'See the current status for parking spaces, then call, text, or rent quickly.',
        statusHeading: parkingAvailable ? 'Parking Available Now' : 'Parking Currently Full',
        statusMessage: parkingAvailable
          ? `We currently have ${siteConfig.availableParkingCount || 'some'} parking space${siteConfig.availableParkingCount === 1 ? '' : 's'} available. Call or text now to rent quickly.`
          : 'Our parking spaces are currently full. Join the waitlist below and we’ll contact you when one opens up.',
        showRent: parkingAvailable,
        rentText: siteConfig.tenantCloudUrl !== '#' ? 'Rent Parking Now' : 'Call to Rent Parking',
        waitlistValue: 'Parking Space'
      };
    }

    return {
      pageTitle: 'Check availability or join the waitlist',
      pageIntro: 'Units go fast. The fastest way to reach Backroad Storage is by phone or text. You can also use the waitlist form below.',
      statusHeading: getSummaryHeading(),
      statusMessage: anyAvailable
        ? 'Call, text, or use the rent button if your online booking link is active.'
        : 'Join the waitlist and we’ll contact you when a space opens up.',
      showRent: anyAvailable,
      rentText: parkingAvailable && !storageAvailable ? 'Call to Rent Parking' : 'Call to Rent',
      waitlistValue: 'Either'
    };
  };

  if (statusText) statusText.textContent = getSummaryHeading();
  if (statusSubtext) statusSubtext.textContent = getSummarySubtext();
  if (availabilityHeading) availabilityHeading.textContent = getSummaryHeading();
  if (availabilityMessage) availabilityMessage.textContent = getAvailabilityMessage();

  const contactView = getContactView();

  if (contactPageTitle) contactPageTitle.textContent = contactView.pageTitle;
  if (contactPageIntro) contactPageIntro.textContent = contactView.pageIntro;
  if (contactStatusHeading) contactStatusHeading.textContent = contactView.statusHeading;
  if (contactStatusMessage) contactStatusMessage.textContent = contactView.statusMessage;
  if (waitlistInterest) waitlistInterest.value = contactView.waitlistValue;

  rentButtons.forEach((btn) => {
    let buttonShouldShow = contactView.showRent;
    let buttonText = contactView.rentText;

    if (btn.id === 'rentNowBtn') {
      buttonShouldShow = anyAvailable;
      buttonText = parkingAvailable && !storageAvailable ? 'Call to Rent Parking' : 'Call to Rent';
    }

    if (!buttonShouldShow) {
      btn.style.display = 'none';
      return;
    }

    if (siteConfig.tenantCloudUrl !== '#') {
      btn.href = siteConfig.tenantCloudUrl;
      btn.style.display = 'inline-flex';
      btn.textContent = buttonText.includes('Call') ? buttonText.replace('Call to ', '') : buttonText;
      btn.setAttribute('target', '_blank');
      btn.setAttribute('rel', 'noopener');
      return;
    }

    btn.style.display = 'inline-flex';
    btn.href = 'tel:2086508712';
    btn.textContent = buttonText;
    btn.removeAttribute('target');
    btn.removeAttribute('rel');
  });
}

function setupMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
}

setupMobileNav();
applyAvailability();
