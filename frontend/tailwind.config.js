/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false,
  },
  content: [
    "./public/index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  important: '#root',
  theme: {
    extend: {
      colors: {
        white: '#FFFFFF',
        black: '#000000',
        border: '#BFC4C9',
        bordercam: '#FFDFE1',
        borderline: '#DEE2E6',
        borderprod: '#F0F0F0',
        brow: '#808A94',
        brownhat: '#ADB4BB',
        cancel: '#E9283B',
        comment: '#F0F2F5',
        ddv: '#BE1E2D',
        ddvbglight: '#FFE0E3',
        ddvborder: '#FEF2F2',
        den: '#001529',
        green: '#1C655E',
        greenlight: '#38C173',
        lightddv: '#FE0136',
        line: '#414141',
        linebreak: '#666666',
        linengang: '#DFE2E4',
        link: '#2F80ED',
        linkkhac: '#2D9CDB',
        linkxanh: '#2980B0',
        login: '#ACACAC',
        orange: '#F2994A',
        placeholderpromo: '#E8E8E8',
        pink: '#FFE7E9',
        uudaibg: '#F6F6F6',
        bodydark: '#AEB7C0',
        bodydark1: '#DEE4EE',
        'boxdark-2': '#1A222C',
        bodydark2: '#8A99AF',
        primary: '#3C50E0',
        boxdark: '#24303F',
        stroke: '#E2E8F0',
        whiten: '#F1F5F9',
        xanhnhat: '#2980B0',
        'meta-1': '#DC3545',
        'meta-2': '#EFF2F7',
        'meta-3': '#10B981',
        'meta-4': '#313D4A',
        'meta-5': '#259AE6',
        'meta-6': '#FFBA00',
        'meta-7': '#FF6766',
        'meta-8': '#F0950C',
        'meta-9': '#E5E7EB',
        'Accent_Color_1': '#3CAEA4',
        'background': '#E5E5E5',
        'bgddv': '#F2F2F2',
        'bghead': '#EBEBEB',
        'bgnew': '#696969',
        'bgpromotion': '#F5F7FD',
        'bgtragop': '#0664F9',
      },
      fontFamily: {
        display: [
          'system-ui',
          'sans-serif',
        ],
      },
      fontSize: {
        base: '14px',
        review: ['1.5rem', '1'],
        10: ['10px', '16px'],
        11: ['11px', '13px'],
        12: ['12px', '14px'],
        13: ['13px', '15px'],
        14: ['14px', '20px'],
        16: ['16px', '20px'],
        17: ['17px', '24px'],
        18: ['18px', '25px'],
        20: ['20px', '30px'],
        24: ['24px', '30px'],
        26: ['26px', '34px'],
        30: ['30px', '37px'],
        34: ['34px', '42px'],
        36: ['36px', '44px'],
        40: ['40px', '50px'],
        45: ['45px', '56px'],
        80: ['80px', '99px'],
        'title-md': ['24px', '30px'],
        xl: ['18px', '22px'],
        lg: ['14px', '17px']
      },
      fontWeight: {
        510: '510',
        590: '590',
      },
      spacing: {
        5.5: '1.375rem',
        6.5: '1.625rem',
        7.5: '1.875rem',
        11.5: '2.875rem',
        72.5: '18.125rem',
      },
      borderWidth: {
        6: '6px',
      },
      zIndex: {
        999999: '999999',
        99999: '99999',
        9999: '9999',
        999: '999',
        400: '400',
        99: '99',
        90: '90',
        9: '9',
        2: '2',
        1: '1',
      },
      dropShadow: {
        1: '0px 1px 0px #E2E8F0',
      },
    },
  },
  plugins: [],
}