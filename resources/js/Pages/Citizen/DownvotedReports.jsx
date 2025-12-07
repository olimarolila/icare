import VoteFeed from "./VoteFeed";

export default function DownvotedReports(props) {
    return (
        <VoteFeed
            {...props}
            heading="Downvoted Reports"
            subheading="Reports you downvoted to flag inaccuracies or duplicates."
            emptyMessage={props.emptyMessage || "No downvoted reports yet."}
        />
    );
}
