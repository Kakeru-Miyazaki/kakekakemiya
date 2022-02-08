'use strict';
{
  const open = document.getElementById('open');
  const close1 = document.getElementById('close1');
  const close2 = document.getElementById('close2');
  const mask = document.getElementById('mask');
  let modal;



  open.addEventListener('click', function () {
    modal.classList.remove('hidden');
    mask.classList.remove('hidden');
  });
  close1.addEventListener('click', function () {
    modal.classList.add('hidden');
    mask.classList.add('hidden');
  });

  close2.addEventListener('click', function () {
    modal.classList.add('hidden');
    mask.classList.add('hidden');
  });

  mask.addEventListener('click', function () {
    modal.classList.add('hidden');
    mask.classList.add('hidden');
  });
}