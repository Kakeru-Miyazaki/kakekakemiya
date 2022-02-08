'use strict';
{
  const open = document.getElementById('open');
  const close1 = document.getElementById('close1');
  const close2 = document.getElementById('close2');
  const close3 = document.getElementById('close3');
  // const modal1 = document.getElementById('modal1');
  // const modal2 = document.getElementById('modal2');
  // const modal3 = document.getElementById('modal3');
  const mask = document.getElementById('mask');
  let modal;



  open.addEventListener('click', function () {
    if (mode == "one") {
      modal = document.getElementById('modal1');
    } else if (mode == "meet") {
      modal = document.getElementById('modal2');
    } else if (mode == "meetWithTime") {
      modal = document.getElementById('modal3');
    }
    modal.classList.remove('hidden');
    mask.classList.remove('hidden');
  });
  close1.addEventListener('click', function () {
    if (mode == "one") {
      modal = document.getElementById('modal1');
    } else if (mode == "meet") {
      modal = document.getElementById('modal2');
    } else if (mode == "meetWithTime") {
      modal = document.getElementById('modal3');
    }
    modal.classList.add('hidden');
    mask.classList.add('hidden');
  });

  close2.addEventListener('click', function () {
    if (mode == "one") {
      modal = document.getElementById('modal1');
    } else if (mode == "meet") {
      modal = document.getElementById('modal2');
    } else if (mode == "meetWithTime") {
      modal = document.getElementById('modal3');
    }
    modal.classList.add('hidden');
    mask.classList.add('hidden');
  });

  close3.addEventListener('click', function () {
    if (mode == "one") {
      modal = document.getElementById('modal1');
    } else if (mode == "meet") {
      modal = document.getElementById('modal2');
    } else if (mode == "meetWithTime") {
      modal = document.getElementById('modal3');
    }
    modal.classList.add('hidden');
    mask.classList.add('hidden');
  });
  mask.addEventListener('click', function () {
    if (mode == "one") {
      modal = document.getElementById('modal1');
    } else if (mode == "meet") {
      modal = document.getElementById('modal2');
    } else if (mode == "meetWithTime") {
      modal = document.getElementById('modal3');
    }
    modal.classList.add('hidden');
    mask.classList.add('hidden');
  });
}