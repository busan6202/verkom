/*!
 * libur-indonesia.js — Pustaka data Hari Libur Nasional & Cuti Bersama Indonesia
 * Sumber: SKB 3 Menteri (Menag, Menaker, PANRB) & Kalender resmi libur nasional.
 *
 * Bila ada penetapan hari libur baru, cukup tambahkan/edit objek di bawah ini
 * tanpa perlu mengubah kode lain. Tanggal harus format "YYYY-MM-DD".
 *
 * Penggunaan di browser:
 *   <script src="./libur-indonesia.js"></script>
 *   LIBUR_INDONESIA.getHolidayDates(2026);          // ['2026-01-01', ...]
 *   LIBUR_INDONESIA.isHoliday('2026-03-21');        // true
 *   LIBUR_INDONESIA.getHolidayName('2026-03-21');   // 'Hari Raya Idul Fitri 1447 Hijriyah'
 */
(function (global) {
  'use strict';

  var DATA = {
    "2025": {
      "2025-01-01": "Tahun Baru 2025 Masehi",
      "2025-01-27": "Isra Mi'raj Nabi Muhammad SAW",
      "2025-01-28": "Cuti Bersama Tahun Baru Imlek 2576 Kongzili",
      "2025-01-29": "Tahun Baru Imlek 2576 Kongzili",
      "2025-03-28": "Cuti Bersama Hari Suci Nyepi Tahun Baru Saka 1947",
      "2025-03-29": "Hari Suci Nyepi Tahun Baru Saka 1947",
      "2025-03-31": "Hari Raya Idul Fitri 1446 Hijriyah",
      "2025-04-01": "Hari Raya Idul Fitri 1446 Hijriyah",
      "2025-04-02": "Cuti Bersama Hari Raya Idul Fitri 1446 Hijriyah",
      "2025-04-03": "Cuti Bersama Hari Raya Idul Fitri 1446 Hijriyah",
      "2025-04-04": "Cuti Bersama Hari Raya Idul Fitri 1446 Hijriyah",
      "2025-04-07": "Cuti Bersama Hari Raya Idul Fitri 1446 Hijriyah",
      "2025-04-18": "Wafat Yesus Kristus / Jumat Agung",
      "2025-04-20": "Kebangkitan Yesus Kristus (Paskah)",
      "2025-05-01": "Hari Buruh Internasional",
      "2025-05-12": "Hari Raya Waisak 2569 BE",
      "2025-05-13": "Cuti Bersama Hari Raya Waisak 2569 BE",
      "2025-05-29": "Kenaikan Yesus Kristus",
      "2025-05-30": "Cuti Bersama Kenaikan Yesus Kristus",
      "2025-06-01": "Hari Lahir Pancasila",
      "2025-06-06": "Hari Raya Idul Adha 1446 Hijriyah",
      "2025-06-09": "Cuti Bersama Hari Raya Idul Adha 1446 Hijriyah",
      "2025-06-27": "Tahun Baru Islam 1447 Hijriyah",
      "2025-08-17": "Hari Kemerdekaan Republik Indonesia",
      "2025-08-18": "Cuti Bersama Hari Kemerdekaan Republik Indonesia",
      "2025-09-05": "Maulid Nabi Muhammad SAW",
      "2025-12-25": "Hari Raya Natal",
      "2025-12-26": "Cuti Bersama Hari Raya Natal"
    },
    "2026": {
      "2026-01-01": "Tahun Baru 2026 Masehi",
      "2026-01-16": "Isra Mi'raj Nabi Muhammad SAW",
      "2026-02-16": "Cuti Bersama Tahun Baru Imlek 2577 Kongzili",
      "2026-02-17": "Tahun Baru Imlek 2577 Kongzili",
      "2026-03-18": "Cuti Bersama Hari Suci Nyepi Tahun Baru Saka 1948",
      "2026-03-19": "Hari Suci Nyepi Tahun Baru Saka 1948",
      "2026-03-20": "Cuti Bersama Hari Raya Idul Fitri 1447 Hijriyah",
      "2026-03-21": "Hari Raya Idul Fitri 1447 Hijriyah",
      "2026-03-22": "Hari Raya Idul Fitri 1447 Hijriyah",
      "2026-03-23": "Cuti Bersama Hari Raya Idul Fitri 1447 Hijriyah",
      "2026-03-24": "Cuti Bersama Hari Raya Idul Fitri 1447 Hijriyah",
      "2026-04-03": "Wafat Yesus Kristus / Jumat Agung",
      "2026-04-05": "Kebangkitan Yesus Kristus (Paskah)",
      "2026-05-01": "Hari Buruh Internasional",
      "2026-05-14": "Kenaikan Yesus Kristus",
      "2026-05-15": "Cuti Bersama Kenaikan Yesus Kristus",
      "2026-05-27": "Hari Raya Idul Adha 1447 Hijriyah",
      "2026-05-28": "Cuti Bersama Hari Raya Idul Adha 1447 Hijriyah",
      "2026-05-31": "Hari Raya Waisak 2570 BE",
      "2026-06-01": "Hari Lahir Pancasila",
      "2026-06-16": "Tahun Baru Islam 1448 Hijriyah",
      "2026-08-17": "Hari Kemerdekaan Republik Indonesia",
      "2026-08-25": "Maulid Nabi Muhammad SAW",
      "2026-12-24": "Cuti Bersama Hari Raya Natal",
      "2026-12-25": "Hari Raya Natal"
    },
    "2027": {
      "2027-01-01": "Tahun Baru 2027 Masehi",
      "2027-01-05": "Isra Mi'raj Nabi Muhammad SAW",
      "2027-02-06": "Tahun Baru Imlek 2578 Kongzili",
      "2027-03-09": "Hari Suci Nyepi Tahun Baru Saka 1949",
      "2027-03-10": "Hari Raya Idul Fitri 1448 Hijriyah",
      "2027-03-26": "Wafat Yesus Kristus / Jumat Agung",
      "2027-05-01": "Hari Buruh Internasional",
      "2027-05-06": "Kenaikan Yesus Kristus",
      "2027-05-17": "Hari Raya Idul Adha 1448 Hijriyah",
      "2027-05-20": "Hari Raya Waisak 2571 BE",
      "2027-06-01": "Hari Lahir Pancasila",
      "2027-06-06": "Tahun Baru Islam 1449 Hijriyah",
      "2027-08-15": "Maulid Nabi Muhammad SAW",
      "2027-08-17": "Hari Kemerdekaan Republik Indonesia",
      "2027-12-25": "Hari Raya Natal",
      "2027-12-26": "Isra Mi'raj Nabi Muhammad SAW"
    }
  };

  var LIBUR_INDONESIA = {
    data: DATA,

    /** Daftar tanggal libur (array 'YYYY-MM-DD') untuk tahun tertentu. */
    getHolidayDates: function (year) {
      return DATA[String(year)] ? Object.keys(DATA[String(year)]).sort() : [];
    },

    /** Cek apakah suatu tanggal ('YYYY-MM-DD') termasuk hari libur. */
    isHoliday: function (dateStr) {
      var year = String(dateStr).slice(0, 4);
      return !!(DATA[year] && DATA[year][dateStr]);
    },

    /** Nama hari libur untuk suatu tanggal ('YYYY-MM-DD'), atau null. */
    getHolidayName: function (dateStr) {
      var year = String(dateStr).slice(0, 4);
      return (DATA[year] && DATA[year][dateStr]) || null;
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = LIBUR_INDONESIA;
  }
  global.LIBUR_INDONESIA = LIBUR_INDONESIA;
})(typeof window !== 'undefined' ? window : globalThis);
