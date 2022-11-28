import { useIsDarkMode } from 'state/user/hooks'

function Etoro({ width, height }: { width?: number; height?: number }) {
  const isDarkMode = useIsDarkMode()

  return (
    <svg width={width || 160} height={height || 51} viewBox="0 0 160 51" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M159.612 19.098C158.69 15.6142 151.517 7.62187 146.292 1.16655C146.189 1.06408 145.882 0.551758 145.267 0.551758C144.755 0.551758 144.345 1.06408 144.55 1.47395C144.755 1.88381 149.775 12.3353 148.853 15.7166C147.931 19.2005 143.32 18.4832 142.603 18.4832C142.193 18.4832 142.5 18.7906 142.91 19.2005C145.472 21.4547 147.111 24.6311 147.111 28.7297V31.8037C147.111 31.9062 147.111 31.9062 147.214 31.9062C153.054 31.3938 161.969 27.8075 159.612 19.098Z"
        fill={isDarkMode ? 'white' : '#00C636'}
      />
      <path
        d="M136.967 39.2835C136.967 42.255 132.971 43.8944 130.409 43.8944C127.643 43.8944 123.749 42.255 123.749 39.2835V28.832C123.749 25.8605 127.643 24.5285 130.409 24.5285C132.971 24.5285 136.967 25.963 136.967 28.832V39.2835ZM130.409 17.9707C124.262 18.0732 117.089 21.557 117.089 28.7296V39.6934C117.089 46.9684 124.262 50.4522 130.409 50.4522C136.455 50.3498 143.628 46.9684 143.628 39.6934V28.832C143.628 21.6595 136.455 18.0732 130.409 17.9707Z"
        fill={isDarkMode ? 'white' : '#00C636'}
      />
      <path
        d="M90.6529 39.2835C90.6529 42.255 86.6567 43.8944 84.0951 43.8944C81.3285 43.8944 77.4348 42.255 77.4348 39.2835V28.832C77.4348 25.8605 81.3285 24.5285 84.0951 24.5285C86.6567 24.5285 90.6529 25.963 90.6529 28.832V39.2835ZM83.9926 17.9707C77.8447 18.0732 70.6721 21.557 70.6721 28.7296V39.6934C70.6721 46.9684 77.8447 50.4522 83.9926 50.4522C90.0381 50.3498 97.2107 46.9684 97.2107 39.6934V28.832C97.2107 21.6595 90.0381 18.0732 83.9926 17.9707Z"
        fill={isDarkMode ? 'white' : '#00C636'}
      />
      <path
        d="M17.1852 19.2005C17.5951 18.7906 17.9025 18.4832 17.4926 18.4832C16.7754 18.4832 12.1644 19.2005 11.2422 15.7166C10.3201 12.2328 15.3409 1.88381 15.5458 1.47395C15.6483 1.06408 15.3409 0.551758 14.7261 0.551758C14.2137 0.551758 13.8039 1.16655 13.7014 1.16655C8.57814 7.62187 1.3031 15.6142 0.380915 19.098C-1.97579 27.8075 7.14363 31.3938 12.8817 32.0086C12.9842 32.0086 12.9842 31.9062 12.9842 31.9062V28.8322C13.0866 24.6311 14.6236 21.4547 17.1852 19.2005Z"
        fill={isDarkMode ? 'white' : '#00C636'}
      />
      <path
        d="M70.2623 20.4303C65.344 19.0983 61.7577 18.5859 56.4295 18.5859C51.2038 18.5859 47.515 19.0983 42.5967 20.4303C42.3918 20.5328 42.2893 20.7377 42.3918 20.8402C44.0312 22.2747 44.7485 24.1191 45.0559 26.1684C47.72 25.5536 50.1791 25.1437 53.0482 24.9388V50.2477C53.0482 50.3502 53.1506 50.3502 53.2531 50.3502H59.6059C59.7084 50.3502 59.8109 50.3502 59.8109 50.2477V24.9388C62.5774 25.1437 64.8317 25.4511 67.4958 26.1684C67.9056 24.1191 68.7254 22.1722 70.4673 20.8402C70.4673 20.6352 70.3648 20.4303 70.2623 20.4303Z"
        fill={isDarkMode ? 'white' : '#00C636'}
      />
      <path
        d="M117.294 18.2783C116.782 18.1758 115.45 17.9709 114.22 18.0733C108.175 18.2783 101.309 21.8646 101.309 28.8322V50.4524C101.309 50.5549 101.412 50.5549 101.514 50.5549H107.867C107.97 50.5549 108.072 50.5549 108.072 50.4524V28.8322C108.072 26.4755 110.941 25.1434 113.298 24.6311C114.015 22.3769 115.347 20.635 117.396 18.9955C117.704 18.6881 117.601 18.2783 117.294 18.2783Z"
        fill={isDarkMode ? 'white' : '#00C636'}
      />
      <path
        d="M35.5265 30.6763C35.5265 30.7787 35.5265 30.7787 35.424 30.8812C35.424 30.9837 35.3216 30.9837 35.2191 30.9837H23.1282V28.8319C23.1282 25.8604 26.7145 24.4259 29.481 24.4259C32.1451 24.4259 35.5265 25.8604 35.5265 28.8319V30.6763ZM29.481 17.7656C23.2307 17.8681 16.3655 21.4544 16.3655 28.7294V39.7957C16.3655 47.1732 23.2307 50.657 29.481 50.7595C33.9895 50.7595 39.0103 48.9151 41.4695 44.9189C41.572 44.8165 41.4695 44.6116 41.367 44.5091C39.2153 43.2795 37.9857 42.5622 35.8339 41.4351C35.7314 41.4351 35.7314 41.4351 35.629 41.5376C34.5018 43.4844 31.5304 44.5091 29.481 44.5091C26.7145 44.5091 23.1282 42.7672 23.1282 39.7957V36.5168H40.4448C41.367 36.5168 42.0843 35.7995 42.0843 34.8773V28.8319C42.0843 21.4544 35.629 17.8681 29.481 17.7656Z"
        fill={isDarkMode ? 'white' : '#00C636'}
      />
    </svg>
  )
}

export default Etoro
