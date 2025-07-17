const HistoryIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      viewBox="0 0 18 18"
      fill="none"
    >
      <path
        d="M9 2.25C12.728 2.25 15.75 5.27198 15.75 9C15.75 12.728 12.728 15.75 9 15.75C5.27198 15.75 2.25 12.728 2.25 9H3.6C3.6 11.9822 6.01785 14.4 9 14.4C11.9822 14.4 14.4 11.9822 14.4 9C14.4 6.01785 11.9822 3.6 9 3.6C7.14375 3.6 5.5062 4.53623 4.53488 5.9625H6.3V7.3125H2.25V3.2625H3.6V4.95C4.8312 3.30975 6.79208 2.25 9 2.25ZM9.675 5.625V8.71988L11.864 10.9089L10.9089 11.864L8.325 9.27878V5.625H9.675Z"
        fill="currentColor"
      />
    </svg>
  );
};
export default HistoryIcon;
