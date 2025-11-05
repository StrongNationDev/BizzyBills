  document.querySelectorAll('.add-money, .contact-us, .service-card, .back-btn, .bell-btn').forEach(el => {
    el.addEventListener('click', function (e) {
      e.preventDefault();

      const targetUrl = this.closest('a').getAttribute('data-target');

      if (this.classList.contains('back-btn') || this.classList.contains('bell-btn')) {
        this.classList.add('jump');
      } else {
        document.body.classList.add('page-exit');
      }

      setTimeout(() => {
        window.location.href = targetUrl;
      }, 600);
    });
  });



  const message = encodeURIComponent("Hey Admin, I am _____, I need some assistance with my BizzyBills account, I want you to help me");

  document.querySelectorAll('.contact-link').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      const platform = this.getAttribute('data-target');
      const icon = this.querySelector('img');

      icon.classList.add('rotate');

      let url = '#';

      switch (platform) {
        case 'whatsapp':
          url = `https://wa.me/2347051851398?text=${message}`;
          break;
        case 'mail':
          url = `mailto:bizzybillsupport@bizzybillsng.store?subject=Support Request&body=${message}`;
          break;
        case 'telegram':
          url = `https://t.me/YourUsernameHere`;
          break;
        case 'instagram':
          url = `https://www.instagram.com/bizzy_bills_ng/`;
          break;
      }

      setTimeout(() => {
        window.open(url, '_blank');
        icon.classList.remove('rotate');
      }, 600);
    });
  });