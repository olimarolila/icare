import VoteFeed from "./VoteFeed";

export default function UpvotedReports(props) {
    return (
        <VoteFeed
            {...props}
            heading="Upvoted Reports"
            subheading="Reports you've supported to signal urgency."
            emptyMessage={props.emptyMessage || "You haven't upvoted any reports yet."}
        />
    );
}
