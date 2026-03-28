// interactivity functions
function showSecret(){
  const sec = document.getElementById("secretText");
  if(sec){
    sec.style.display = 'block';
    sec.classList.remove('hidden');
    sec.classList.add('visible');
  }
}

function openLetter(){
  const letter = document.getElementById("letter");
  if(letter){
    letter.style.display = 'block';
    letter.style.transform = 'translateY(-10px)';
    letter.style.opacity = 0;
    setTimeout(() => {
      letter.style.opacity = 1;
      letter.style.transform = 'none';
    }, 10);
  }
}

// falling hearts
function createHeart(){
  const heart=document.createElement("div");
  heart.innerHTML="❤️";
  heart.style.position="fixed";
  heart.style.left=Math.random()*100+"vw";
  heart.style.top="-20px";
  heart.style.fontSize="20px";
  document.body.appendChild(heart);
  let fall=setInterval(()=>{
    let top=parseInt(heart.style.top);
    if(top>window.innerHeight){
      heart.remove();
      clearInterval(fall);
    }
    heart.style.top=top+3+"px";
  },30);
}
setInterval(createHeart,500);

// page initialization (greeting, timer, audio) without prompts
window.addEventListener('DOMContentLoaded',()=>{
  // optional: pull from localStorage if user manually set earlier
  const name = localStorage.getItem('gf_name') || 'Моя любимая';
  const greet = document.getElementById('greeting');
  if(greet) greet.textContent = name + ', я тебя очень люблю!';

  // elapsed timer since relationship start
  const startInput = localStorage.getItem('gf_start') || '2024-02-08';
  let startDate = new Date(startInput);
  if(isNaN(startDate)){
    startDate = new Date();
  }

  function updateTimer(){
    const now = new Date();
    let diff = now - startDate;
    if(diff<0) diff = 0;
    const d = Math.floor(diff/1000/60/60/24);
    const h = Math.floor(diff/1000/60/60)%24;
    const m = Math.floor(diff/1000/60)%60;
    const s = Math.floor(diff/1000)%60;
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minsEl = document.getElementById('minutes');
    const secsEl = document.getElementById('seconds');
    if(daysEl) daysEl.textContent=d;
    if(hoursEl) hoursEl.textContent=h;
    if(minsEl) minsEl.textContent=m;
    if(secsEl) secsEl.textContent=s;
  }
  updateTimer();
  setInterval(updateTimer,1000);

  // reasons list functionality
  const reasons = [
    'Ты даришь мне улыбку каждый день.',
    'Ты такая добрая и заботливая.',
    'С тобой мне всегда комфортно и спокойно.',
    'Ты вдохновляешь меня становиться лучше.',
    'Твоя смех – моя любимая музыка.',
    'Ты понимаешь меня без слов.',
    'Каждый момент с тобой – это счастье.',
    'Твоя поддержка помогает мне идти вперёд.',
    'У тебя очень красивые глаза',
    'Ты всегда решительна и умная',
    'Ты помогаешь мне быть уверенным и не сомневаться',
    'Люблю проводить с тобой время',
    'САМАЯ ЗАБОТЛИВАЯ И ЛУЧШАЯ ДЕВУШКА',
    'Не хватит слов о том насколько я тебя люблю'

  ];
  let reasonIndex = 0;
  const display = document.getElementById('reasonDisplay');
  const nextBtn = document.getElementById('nextReasonBtn');
  function showNextReason(){
    if(!display) return;
    display.textContent = reasons[reasonIndex] || '';
    reasonIndex = (reasonIndex + 1) % reasons.length;
  }
  if(nextBtn){
    nextBtn.addEventListener('click', showNextReason);
  }

  // surprise button behavior for домашняя ссылка
  const surpriseBtn = document.getElementById('surpriseBtn');
  if(surpriseBtn){
    surpriseBtn.addEventListener('click', (event) => {
      event.preventDefault();
      showSecret();
    });
  }

  // gallery modal functionality
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modalImg');
  const photos = document.querySelectorAll('.photo');
  const modalClose = document.querySelector('.modal-close');
  const photoArray = Array.from(photos);
  let currentPhotoIndex = -1;

  function openModalAt(index){
    if(!modal || !modalImg || photoArray.length===0) return;
    currentPhotoIndex = (index + photoArray.length) % photoArray.length;
    modalImg.src = photoArray[currentPhotoIndex].src;
    modal.style.display = 'flex';
  }

  function changeModal(delta){
    if(currentPhotoIndex < 0) return;
    openModalAt(currentPhotoIndex + delta);
  }

  photos.forEach((img, index) => {
    img.addEventListener('click', ()=>{
      openModalAt(index);
    });
  });

  if(modalClose){
    modalClose.addEventListener('click', ()=>{
      if(modal) {
        modal.style.display='none';
        currentPhotoIndex = -1;
      }
    });
  }

  const modalPrev = document.querySelector('.modal-prev');
  const modalNext = document.querySelector('.modal-next');
  if(modalPrev){
    modalPrev.addEventListener('click', (e)=>{
      e.stopPropagation();
      changeModal(-1);
    });
  }
  if(modalNext){
    modalNext.addEventListener('click', (e)=>{
      e.stopPropagation();
      changeModal(1);
    });
  }

  if(modal){
    modal.addEventListener('click', e=>{
      if(e.target===modal){
        modal.style.display='none';
        currentPhotoIndex = -1;
      }
    });

    // swipe support
    let touchStartX = 0;
    modal.addEventListener('touchstart', e=>{
      if(e.touches && e.touches.length > 0){
        touchStartX = e.touches[0].clientX;
      }
    });
    modal.addEventListener('touchend', e=>{
      if(e.changedTouches && e.changedTouches.length > 0){
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchEndX - touchStartX;
        if(Math.abs(diff) > 50){
          if(diff < 0){
            changeModal(1);
          } else {
            changeModal(-1);
          }
        }
      }
    });
  }

  // audio control
  const audio = document.getElementById('bgAudio');
  const audioBtn = document.getElementById('audioBtn');
  if(audio && audioBtn){
    audioBtn.addEventListener('click',()=>{
      if(audio.paused){
        audio.play();
        audioBtn.textContent = 'Пауза музыки';
      } else {
        audio.pause();
        audioBtn.textContent = 'Воспроизвести музыку';
      }
    });
  }
});