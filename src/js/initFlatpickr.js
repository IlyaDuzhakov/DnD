import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Russian } from "flatpickr/dist/l10n/ru.js";

export function initFlatpickr() {
  flatpickr("#calendar", {
    locale: Russian,
    inline: true,
    defaultDate: new Date(),
  });
}