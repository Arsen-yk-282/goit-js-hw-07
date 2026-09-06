import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const dateTimePicker = document.querySelector('#datetime-picker');
const startButton = document.querySelector('[data-start]');
const daysValue = document.querySelector('[data-days]');
const hoursValue = document.querySelector('[data-hours]');
const minutesValue = document.querySelector('[data-minutes]');
const secondsValue = document.querySelector('[data-seconds]');

let userSelectedDate = null;
let timerId = null;

startButton.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

    if (!selectedDate || selectedDate.getTime() <= Date.now()) {
      userSelectedDate = null;
      startButton.disabled = true;

      iziToast.error({
        message: 'Please choose a date in the future',
        position: 'topRight',
      });

      return;
    }

    userSelectedDate = selectedDate;
    startButton.disabled = false;
  },
};

flatpickr(dateTimePicker, options);

startButton.addEventListener('click', () => {
  if (!userSelectedDate) {
    return;
  }

  startButton.disabled = true;
  dateTimePicker.disabled = true;

  updateTimer();
  timerId = setInterval(updateTimer, 1000);
});

function updateTimer() {
  const timeLeft = userSelectedDate.getTime() - Date.now();

  if (timeLeft <= 0) {
    clearInterval(timerId);
    timerId = null;

    renderTimer({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });

    dateTimePicker.disabled = false;
    startButton.disabled = true;
    userSelectedDate = null;
    return;
  }

  renderTimer(convertMs(timeLeft));
}

function renderTimer({ days, hours, minutes, seconds }) {
  daysValue.textContent = addLeadingZero(days);
  hoursValue.textContent = addLeadingZero(hours);
  minutesValue.textContent = addLeadingZero(minutes);
  secondsValue.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
