import { cn } from "@phunq/utils";
import styles from "./loading-dots.module.css";

interface LoadingDotsProps {
	color?: string;
	className?: string;
}

const LoadingDots = ({ color = "#000", className }: LoadingDotsProps) => {
	return (
		<span className={cn(styles.loadingDots, className)}>
			<span style={{ backgroundColor: color }} />
			<span style={{ backgroundColor: color }} />
			<span style={{ backgroundColor: color }} />
		</span>
	);
};

export default LoadingDots;
