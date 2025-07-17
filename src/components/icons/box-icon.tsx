const BoxIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      viewBox="0 0 19 18"
      fill="none"
    >
      <path
        d="M9.5 2.8125L14.8438 5.90625V12.0938L9.5 15.1875L4.15625 12.0938V5.90625L9.5 2.8125ZM5.84031 6.23121L9.50006 8.34998L13.1597 6.23123L9.5 4.11244L5.84031 6.23121ZM5.28125 7.20748V11.4451L8.93756 13.5619V9.32428L5.28125 7.20748ZM10.0626 13.5619L13.7188 11.4451V7.20752L10.0626 9.32428V13.5619Z"
        fill="currentColor"
      />
    </svg>
  );
};
export default BoxIcon;
