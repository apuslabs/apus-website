import React, { FC } from "react";

interface IconProps {
  name: string;
  size?: string | number;
  color?: string;
}

export const Icon: FC<IconProps> = (props) => {
  const { name, size, color } = props;

  const SvgIcon =
    SvgList[name] &&
    React.cloneElement(SvgList[name], {
      width: size,
      height: size,
      fill: color,
    });

  return <>{SvgIcon}</>;
};

Icon.defaultProps = {
  size: 20,
  color: "#000",
};

const SvgList: Record<string, JSX.Element> = {
  Dashboard: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_5_211)">
        <path
          d="M8.4375 14.625H2.8125C1.26169 14.625 0 15.8867 0 17.4375V21.1875C0 22.7383 1.26169 24 2.8125 24H8.4375C9.98831 24 11.25 22.7383 11.25 21.1875V17.4375C11.25 15.8867 9.98831 14.625 8.4375 14.625ZM9.375 21.1875C9.375 21.7044 8.95444 22.125 8.4375 22.125H2.8125C2.29556 22.125 1.875 21.7044 1.875 21.1875V17.4375C1.875 16.9206 2.29556 16.5 2.8125 16.5H8.4375C8.95444 16.5 9.375 16.9206 9.375 17.4375V21.1875ZM21.1875 0H15.5625C14.0117 0 12.75 1.26169 12.75 2.8125V6.5625C12.75 8.11331 14.0117 9.375 15.5625 9.375H21.1875C22.7383 9.375 24 8.11331 24 6.5625V2.8125C24 1.26169 22.7383 0 21.1875 0ZM22.125 6.5625C22.125 7.07944 21.7044 7.5 21.1875 7.5H15.5625C15.0456 7.5 14.625 7.07944 14.625 6.5625V2.8125C14.625 2.29556 15.0456 1.875 15.5625 1.875H21.1875C21.7044 1.875 22.125 2.29556 22.125 2.8125V6.5625ZM21.1875 10.875H15.5625C14.0117 10.875 12.75 12.1367 12.75 13.6875V21.1875C12.75 22.7383 14.0117 24 15.5625 24H21.1875C22.7383 24 24 22.7383 24 21.1875V13.6875C24 12.1367 22.7383 10.875 21.1875 10.875ZM22.125 21.1875C22.125 21.7044 21.7044 22.125 21.1875 22.125H15.5625C15.0456 22.125 14.625 21.7044 14.625 21.1875V13.6875C14.625 13.1706 15.0456 12.75 15.5625 12.75H21.1875C21.7044 12.75 22.125 13.1706 22.125 13.6875V21.1875ZM8.4375 0H2.8125C1.26169 0 0 1.26169 0 2.8125V10.3125C0 11.8633 1.26169 13.125 2.8125 13.125H8.4375C9.98831 13.125 11.25 11.8633 11.25 10.3125V2.8125C11.25 1.26169 9.98831 0 8.4375 0ZM9.375 10.3125C9.375 10.8294 8.95444 11.25 8.4375 11.25H2.8125C2.29556 11.25 1.875 10.8294 1.875 10.3125V2.8125C1.875 2.29556 2.29556 1.875 2.8125 1.875H8.4375C8.95444 1.875 9.375 2.29556 9.375 2.8125V10.3125Z"
          fill="#9B98B1"
        />
      </g>
      <defs>
        <clipPath id="clip0_5_211">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  ),
  Node: (
    <svg viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M23.4254 12.7705L18.2812 11.0557V3.07818C18.2812 2.77556 18.0875 2.50687 17.8004 2.41115L12.1754 0.536157C12.0311 0.488064 11.875 0.488157 11.7307 0.536157L6.10573 2.41115C5.81863 2.50682 5.62499 2.77551 5.62499 3.07818V11.0557L0.480749 12.7705C0.19364 12.8662 0 13.1349 0 13.4375V21.9219C0 22.2245 0.19364 22.4932 0.480749 22.5889L6.10573 24.4639C6.17792 24.488 6.25302 24.5 6.32811 24.5C6.4032 24.5 6.4783 24.488 6.55048 24.4639L11.9531 22.663L17.3558 24.4639C17.4279 24.488 17.503 24.5 17.5781 24.5C17.6531 24.5 17.7283 24.488 17.8004 24.4639L23.4254 22.5889C23.7125 22.4932 23.9062 22.2245 23.9062 21.9219V13.4375C23.9062 13.1349 23.7125 12.8662 23.4254 12.7705ZM17.5781 14.5713L14.1766 13.4375L17.5781 12.3037L20.9796 13.4375L17.5781 14.5713ZM6.32811 12.3037L9.72958 13.4375L6.32811 14.5713L2.92659 13.4375L6.32811 12.3037ZM11.25 5.45994V12.462L7.03123 11.0557V4.05369L11.25 5.45994ZM16.875 11.0557L12.6562 12.462V5.45994L16.875 4.05369V11.0557ZM7.03123 15.8193L11.25 14.413V21.4151L7.03123 22.8213V15.8193ZM11.9531 1.94433L15.3546 3.07818L11.9531 4.21199L8.55157 3.07818L11.9531 1.94433ZM1.40625 14.413L5.62499 15.8193V22.8213L1.40625 21.4151V14.413ZM12.6562 14.413L16.875 15.8193V22.8213L12.6562 21.4151V14.413ZM18.2812 22.8213V15.8193L22.4999 14.413V21.4151L18.2812 22.8213Z"
        fill="white"
      />
    </svg>
  ),
  Brain: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M19.9026 12.7038C20.1929 13.5222 20.9744 14.1101 21.8911 14.1101C23.0542 14.1101 24.0005 13.1638 24.0005 12.0007C24.0005 10.8375 23.0542 9.89125 21.8911 9.89125C20.9744 9.89125 20.1929 10.4792 19.9026 11.2975H12.7034V9.70895H17.927L19.0602 8.57577C19.3356 8.70782 19.6438 8.78193 19.9691 8.78193C21.1322 8.78193 22.0785 7.83565 22.0785 6.67251C22.0785 5.50938 21.1322 4.56309 19.9691 4.56309C18.806 4.56309 17.8597 5.50938 17.8597 6.67251C17.8597 6.99774 17.9338 7.30599 18.0658 7.58139L17.3446 8.30267H12.7034V6.89522L16.4956 5.96051V4.09831C16.7837 3.99697 17.0541 3.8314 17.284 3.60138C18.1065 2.77894 18.1065 1.44068 17.284 0.61819C16.4616 -0.204296 15.1234 -0.20425 14.3009 0.61819C13.4784 1.44063 13.4784 2.77889 14.3009 3.60138C14.5309 3.83135 14.8012 3.99692 15.0893 4.09827V4.85869L12.7034 5.44689V4.63833C12.7034 2.61052 11.0536 0.96076 9.02584 0.96076C7.38054 0.96076 5.95504 2.05789 5.50029 3.59243C3.73297 3.85915 2.3739 5.38825 2.3739 7.22874V7.77236C1.01487 8.09126 0 9.31351 0 10.7684V13.233C0 14.6878 1.01487 15.9101 2.3739 16.2289V16.7726C2.3739 18.6131 3.73297 20.1422 5.50029 20.4089C5.95504 21.9435 7.38054 23.0406 9.02584 23.0406C11.0536 23.0406 12.7034 21.3908 12.7034 19.363V18.5545L15.0893 19.1426V19.9031C14.8012 20.0044 14.5309 20.17 14.3009 20.4C13.4784 21.2224 13.4784 22.5607 14.3009 23.3832C14.7121 23.7944 15.2523 24 15.7925 24C16.3327 24 16.8728 23.7944 17.284 23.3832C18.1065 22.5607 18.1065 21.2225 17.284 20.4C17.0541 20.17 16.7837 20.0044 16.4956 19.903V18.0409L12.7034 17.1061V15.6987H17.3445L18.0658 16.42C17.9337 16.6954 17.8596 17.0036 17.8596 17.3288C17.8596 18.492 18.8059 19.4383 19.969 19.4383C21.1322 19.4383 22.0785 18.492 22.0785 17.3288C22.0785 16.1657 21.1322 15.2194 19.969 15.2194C19.6438 15.2194 19.3355 15.2935 19.0601 15.4256L17.927 14.2924H12.7034V12.7038H19.9026ZM21.8911 11.2975C22.2788 11.2975 22.5942 11.613 22.5942 12.0007C22.5942 12.3884 22.2788 12.7038 21.8911 12.7038C21.5034 12.7038 21.188 12.3884 21.188 12.0007C21.188 11.613 21.5034 11.2975 21.8911 11.2975ZM19.9691 5.96937C20.3568 5.96937 20.6722 6.2848 20.6722 6.67251C20.6722 7.06022 20.3568 7.37565 19.9691 7.37565C19.5814 7.37565 19.266 7.06022 19.266 6.67251C19.266 6.2848 19.5814 5.96937 19.9691 5.96937ZM15.2953 1.61262C15.5695 1.33849 16.0156 1.33853 16.2897 1.61262C16.4225 1.74542 16.4956 1.922 16.4956 2.10983C16.4956 2.29766 16.4225 2.4742 16.2897 2.60705C16.0155 2.88118 15.5694 2.88113 15.2953 2.60705C15.0211 2.33287 15.0211 1.8868 15.2953 1.61262ZM11.2971 19.363C11.2971 20.6154 10.2782 21.6343 9.02584 21.6343C7.75737 21.6343 6.75348 20.5752 6.75348 19.3625C6.75348 18.7386 7.00131 18.1568 7.45132 17.7243L6.47686 16.7104C5.85111 17.3118 5.46771 18.0918 5.37181 18.94C4.45041 18.6504 3.78018 17.7883 3.78018 16.7726L3.78013 14.9038H3.07699C2.15578 14.9037 1.40628 14.1542 1.40628 13.233V10.7684C1.40628 10.0983 1.80309 9.51934 2.3739 9.25336C2.3739 11.105 3.77474 12.458 5.49659 12.458V11.0517C4.55016 11.0517 3.78018 10.2817 3.78018 9.3353V7.22884C3.78018 6.21308 4.45036 5.35093 5.37181 5.06143C5.46771 5.90965 5.85111 6.68967 6.47686 7.29104L7.45132 6.27711C7.00131 5.84463 6.75348 5.26286 6.75348 4.63894C6.75348 3.38664 7.772 2.36779 9.0241 2.36713C10.2765 2.36709 11.2971 3.38599 11.2971 4.63833V19.363ZM15.2953 21.3944C15.5695 21.1202 16.0155 21.1202 16.2897 21.3944C16.4225 21.5271 16.4956 21.7037 16.4956 21.8916C16.4956 22.0794 16.4225 22.2559 16.2897 22.3888C16.0155 22.6629 15.5694 22.6629 15.2953 22.3888C15.0211 22.1146 15.0211 21.6685 15.2953 21.3944ZM19.9691 16.6257C20.3568 16.6257 20.6722 16.9411 20.6722 17.3288C20.6722 17.7166 20.3568 18.032 19.9691 18.032C19.5814 18.032 19.266 17.7166 19.266 17.3288C19.266 16.9411 19.5814 16.6257 19.9691 16.6257Z"
        fill="#9B98B1"
      />
    </svg>
  ),
  Return: (
    <svg viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.8418 5.09179H3.60798L6.79413 1.92107C7.14965 1.56724 7.15101 0.99221 6.79718 0.636694C6.44334 0.281133 5.86827 0.279816 5.51275 0.633606L0.76721 5.35626C0.766892 5.35653 0.766665 5.35685 0.766393 5.35712C0.411785 5.71096 0.41065 6.28785 0.766302 6.64286C0.76662 6.64314 0.766847 6.64345 0.76712 6.64373L5.51266 11.3664C5.86813 11.7201 6.4432 11.7189 6.79708 11.3633C7.15092 11.0078 7.14956 10.4327 6.79404 10.0789L3.60798 6.9082H22.8418C23.3434 6.9082 23.75 6.50159 23.75 5.99999C23.75 5.49839 23.3434 5.09179 22.8418 5.09179Z"
        fill="white"
      />
    </svg>
  ),
  Total: (
    <svg viewBox="0 0 79 78" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g opacity="0.7">
        <path
          d="M75.6506 24.3282C73.7498 19.6242 70.8927 15.2138 67.089 11.4107C63.2859 7.60713 58.8755 4.74993 54.1715 2.84913C49.4671 0.947883 44.4688 0 39.473 0C34.4841 0 29.495 0.951996 24.8 2.85553C20.1057 4.7583 15.7059 7.61505 11.9107 11.4109C8.11505 15.2059 5.25815 19.6057 3.35538 24.3002C1.452 28.9947 0.5 33.9836 0.5 38.9727C0.5 43.9688 1.44788 48.9671 3.34898 53.6716C5.24977 58.3757 8.10683 62.7862 11.9105 66.5893C15.7137 70.3929 20.124 73.2501 24.8281 75.1509C29.5328 77.0521 34.5308 77.9998 39.5268 78.0002C44.5158 78.0002 49.5049 77.0482 54.1998 75.1448C58.8941 73.242 63.294 70.3853 67.0891 66.5895C70.8848 62.7943 73.7417 58.3944 75.6445 53.7C77.5479 49.0052 78.4998 44.0162 78.5 39.027C78.4997 34.031 77.552 29.0329 75.6506 24.3282ZM70.8235 51.7452C69.175 55.8102 66.7075 59.6135 63.4107 62.9108C60.1135 66.2075 56.3102 68.675 52.2452 70.3237C48.1808 71.9718 43.8544 72.7979 39.527 72.7979C35.1887 72.7979 30.8514 71.9743 26.7776 70.3278C22.7033 68.6805 18.8923 66.2133 15.5893 62.911C12.2867 59.6078 9.81948 55.797 8.17249 51.7225C6.52596 47.6487 5.70239 43.3113 5.70254 38.973C5.70223 34.6456 6.52855 30.3193 8.17645 26.2549C9.82496 22.1899 12.2925 18.3867 15.5893 15.0895C18.8865 11.7928 22.6898 9.32527 26.7549 7.6766C30.8193 6.02855 35.1457 5.20239 39.4732 5.20239C43.8115 5.20239 48.1487 6.0258 52.2225 7.67249C56.2968 9.31978 60.1078 11.7868 63.4108 15.0893C66.7135 18.3925 69.1805 22.2033 70.8277 26.2776C72.4742 30.3514 73.2978 34.6887 73.2978 39.027C73.2978 43.3544 72.4716 47.6807 70.8235 51.7452Z"
          fill="white"
        />
        <path
          d="M54.7738 27.9708C56.1795 27.9708 57.319 26.8313 57.319 25.4256V20.3355C57.319 19.6653 57.0476 19.0096 56.5736 18.5357C56.0997 18.0618 55.4441 17.7903 54.7738 17.7903H24.2321C23.2503 17.7903 22.3526 18.3582 21.9322 19.2455C21.5117 20.1329 21.6404 21.1871 22.2623 21.9471L36.2146 38.9997L22.2625 56.0526C21.6406 56.8124 21.5119 57.8669 21.9323 58.7543C22.3528 59.6417 23.2504 60.2095 24.2323 60.2095H54.7738C55.444 60.2095 56.0995 59.938 56.5736 59.4641C57.0477 58.9901 57.319 58.3346 57.319 57.6643V52.574C57.319 51.1683 56.1795 50.0288 54.7738 50.0288C53.3682 50.0288 52.2286 51.1683 52.2286 52.574V55.1192H29.603L41.4729 40.6117C42.2417 39.672 42.2417 38.3279 41.4729 37.3884L29.603 22.8808H52.2286V25.4259C52.2288 26.8311 53.3683 27.9708 54.7738 27.9708Z"
          fill="white"
        />
      </g>
    </svg>
  ),
  Task: (
    <svg viewBox="0 0 60 78" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g opacity="0.7">
        <path
          d="M57.2587 7.02777C55.6774 5.44309 53.5744 4.57031 51.337 4.57031H47.5576V3.80859C47.5576 1.70854 45.8491 0 43.749 0H16.3272C14.2271 0 12.5186 1.70854 12.5186 3.80859V4.57031H8.72566C4.11558 4.57031 0.360767 8.32498 0.355587 12.9399L0.292974 69.6118C0.290536 71.8516 1.15996 73.9579 2.74114 75.5425C4.32247 77.1272 6.42557 78 8.66304 78H51.2742C55.8844 78 59.6392 74.2453 59.6443 69.6304L59.707 12.9585C59.7096 10.7186 58.84 8.6123 57.2587 7.02777ZM17.0889 4.57031H42.9873V9.14062H17.0889V4.57031ZM55.0788 69.6252C55.0764 71.7231 53.3697 73.4297 51.2742 73.4297H8.66304C7.646 73.4297 6.69004 73.033 5.97128 72.3127C5.25253 71.5923 4.85735 70.6349 4.85841 69.617L4.92102 12.9451C4.92331 10.8472 6.63002 9.14062 8.72566 9.14062H12.5186V9.90234C12.5186 12.0024 14.2271 13.7109 16.3272 13.7109H43.749C45.8491 13.7109 47.5576 12.0024 47.5576 9.90234V9.14062H51.337C52.354 9.14062 53.31 9.53733 54.0287 10.2576C54.7475 10.9779 55.1428 11.9354 55.1416 12.9533L55.0788 69.6252Z"
          fill="white"
        />
        <path
          d="M30.7764 30.4688H47.0118C48.2738 30.4688 49.297 29.4456 49.297 28.1836C49.297 26.9216 48.2738 25.8984 47.0118 25.8984H30.7764C29.5144 25.8984 28.4912 26.9216 28.4912 28.1836C28.4912 29.4456 29.5144 30.4688 30.7764 30.4688Z"
          fill="white"
        />
        <path
          d="M30.7764 45.7031H47.0118C48.2738 45.7031 49.297 44.68 49.297 43.418C49.297 42.156 48.2738 41.1328 47.0118 41.1328H30.7764C29.5144 41.1328 28.4912 42.156 28.4912 43.418C28.4912 44.68 29.5144 45.7031 30.7764 45.7031Z"
          fill="white"
        />
        <path
          d="M47.0771 56.3672H30.7764C29.5144 56.3672 28.4912 57.3903 28.4912 58.6523C28.4912 59.9144 29.5144 60.9375 30.7764 60.9375H47.0771C48.3392 60.9375 49.3623 59.9144 49.3623 58.6523C49.3623 57.3903 48.3393 56.3672 47.0771 56.3672Z"
          fill="white"
        />
        <path
          d="M21.0511 21.9614L15.7812 27.2313L14.5387 25.9886C13.6463 25.0962 12.1994 25.0962 11.307 25.9886C10.4146 26.8809 10.4146 28.3279 11.307 29.2203L14.1654 32.0789C14.594 32.5074 15.1752 32.7483 15.7814 32.7483C16.3874 32.7483 16.9686 32.5076 17.3971 32.0789L24.2829 25.1932C25.1753 24.301 25.1753 22.854 24.2829 21.9616C23.3905 21.069 21.9437 21.069 21.0511 21.9614Z"
          fill="white"
        />
        <path
          d="M21.0511 38.3593L15.7812 43.6291L14.5387 42.3866C13.6463 41.4942 12.1994 41.4942 11.307 42.3866C10.4146 43.2789 10.4146 44.7257 11.307 45.6183L14.1654 48.4769C14.594 48.9054 15.1752 49.1463 15.7814 49.1463C16.3874 49.1463 16.9687 48.9056 17.3971 48.4769L24.2829 41.5911C25.1753 40.6988 25.1753 39.2518 24.2829 38.3594C23.3905 37.467 21.9435 37.467 21.0511 38.3593Z"
          fill="white"
        />
        <path
          d="M21.0511 53.5936L15.7812 58.8635L14.5387 57.621C13.6463 56.7286 12.1994 56.7286 11.307 57.621C10.4146 58.5133 10.4146 59.9601 11.307 60.8527L14.1654 63.7112C14.594 64.1398 15.1752 64.3806 15.7814 64.3806C16.3874 64.3806 16.9687 64.1399 17.3971 63.7112L24.2829 56.8254C25.1753 55.9332 25.1753 54.4862 24.2829 53.5938C23.3905 52.7014 21.9435 52.7013 21.0511 53.5936Z"
          fill="white"
        />
      </g>
    </svg>
  ),
  Mining: (
    <svg viewBox="0 0 76 76" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g opacity="0.7">
        <path
          d="M74.9502 31.7402C74.2975 31.3391 73.4811 31.2988 72.7907 31.6337L63.736 36.0282C63.2993 36.2402 62.9449 36.5876 62.7273 37.0173L57.2722 47.784L50.9256 49.0284C50.2506 49.1607 49.6756 49.5935 49.368 50.2009L45.5303 57.7753H37.9999C37.2515 57.7753 36.5531 58.1465 36.1412 58.763L27.235 72.0931C26.784 72.768 26.745 73.6327 27.1333 74.3443C27.5216 75.056 28.2745 75.4999 29.0937 75.4999H73.7734C75.003 75.4999 75.9999 74.5161 75.9999 73.3026C75.9999 71.1367 75.9999 35.9746 75.9999 33.6054C75.9999 32.8464 75.603 32.1412 74.9502 31.7402ZM66.3748 39.6449L71.5468 37.1346V44.9853L62.7998 46.7003L66.3748 39.6449ZM33.2289 71.1055L39.199 62.17H58.6553L61.6403 71.1055H33.2289ZM60.2656 57.7754H50.5088L52.863 53.1291L71.5468 49.4658V71.1055H66.3291L62.3802 59.2848C62.0793 58.3839 61.2267 57.7754 60.2656 57.7754Z"
          fill="white"
        />
        <path
          d="M0 50.1248C0 50.7077 0.234531 51.2664 0.652234 51.6784L6.94999 57.8933C7.38477 58.3224 7.95462 58.5368 8.52432 58.5368C9.09402 58.5368 9.66402 58.3224 10.0986 57.8932L40.0125 28.3729L54.1822 42.3562C54.728 42.8948 55.5174 43.1161 56.2682 42.9409C57.0193 42.766 57.6249 42.2198 57.869 41.4973C60.0645 34.9975 58.3529 27.8274 53.4388 22.9782L49.4589 19.0506L51.0333 17.4969C51.9022 16.6395 51.9028 15.2475 51.0333 14.3895L44.7355 8.17476C43.8661 7.31666 42.4562 7.31666 41.5867 8.17476L40.0127 9.72852L36.0326 5.80098C31.1233 0.956011 23.8592 -0.739253 17.2668 1.42916C16.5347 1.66998 15.9812 2.26778 15.804 3.00884C15.6268 3.74991 15.8509 4.52891 16.3966 5.06739L30.5662 19.0508L0.652234 48.5711C0.234531 48.9831 0 49.5421 0 50.1248ZM50.2902 26.0857C53.0888 28.8475 54.5135 32.5481 54.3544 36.3112L43.1615 25.2655L46.3103 22.1582L50.2902 26.0857ZM46.3104 15.9433C45.8062 16.4407 40.7577 21.423 40.0127 22.158L36.8637 19.0506C37.4134 18.5082 42.3041 13.6818 43.1615 12.8359L46.3104 15.9433ZM32.8838 8.90835L36.8639 12.8359L33.7149 15.9433L22.5221 4.89761C26.334 4.74161 30.0853 6.14654 32.8838 8.90835ZM33.7149 22.1582L36.8639 25.2655L8.52432 53.232L5.37537 50.1247L33.7149 22.1582Z"
          fill="white"
        />
        <path
          d="M63.7225 31.1763C64.8245 31.72 66.1607 31.2769 66.7097 30.1937L71.1628 21.4046C71.7127 20.3191 71.267 18.9995 70.1671 18.4566C69.0676 17.9142 67.7299 18.3538 67.1799 19.4392L62.7268 28.2283C62.1768 29.3137 62.6226 30.6335 63.7225 31.1763Z"
          fill="white"
        />
        <path
          d="M41.4569 44.8237L32.5506 49.2182C31.4507 49.761 31.005 51.0808 31.5549 52.1662C32.1049 53.252 33.4424 53.6916 34.5421 53.1488L43.4483 48.7543C44.5482 48.2116 44.994 46.8918 44.444 45.8063C43.8942 44.721 42.5568 44.2808 41.4569 44.8237Z"
          fill="white"
        />
      </g>
    </svg>
  ),
  Link: (
    <svg viewBox="0 0 37 31" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g opacity="0.7">
        <path
          d="M21.2105 4.54967L20.5611 6.45805L29.0531 9.34799L3.80458 21.7752L4.69481 23.5839L29.9433 11.1567L27.0535 19.6486L28.9618 20.2981L32.9604 8.54819L21.2105 4.54967Z"
          fill="white"
        />
      </g>
    </svg>
  ),
  ArrowRight: (
    <svg viewBox="0 0 10 16" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.00751 14.6995L7.99251 7.71449L1.00751 0.729492"
        stroke="white"
        stroke-width="2"
        stroke-miterlimit="10"
      />
    </svg>
  ),
  Menu: (
    <svg
      viewBox="0 0 36 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M35.8965 1.06348C35.8965 0.511192 35.4488 0.0634765 34.8965 0.0634765L1.41417 0.0634751C0.861885 0.063475 0.414169 0.51119 0.414169 1.06347L0.414169 2.06348C0.414169 2.61576 0.861885 3.06348 1.41417 3.06348L34.8965 3.06348C35.4488 3.06348 35.8965 2.61576 35.8965 2.06348L35.8965 1.06348ZM35.8965 13.7437C35.8965 13.1914 35.4488 12.7437 34.8965 12.7437L1.41417 12.7437C0.861885 12.7437 0.414169 13.1914 0.414169 13.7437L0.414169 14.7437C0.414169 15.2959 0.861884 15.7437 1.41417 15.7437L34.8965 15.7437C35.4488 15.7437 35.8965 15.2959 35.8965 14.7437L35.8965 13.7437Z"
        fill="white"
      />
      <rect
        opacity="0.3"
        width="3"
        height="35.4157"
        rx="1"
        transform="matrix(1.19249e-08 1 -0.999938 -0.0110933 35.9697 24.1171)"
        fill="white"
      />
    </svg>
  ),
};
