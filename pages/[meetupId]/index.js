import MeetupDetail from "../../components/meetups/MeetupDetail";
import { MongoClient, ObjectId } from "mongodb";
import { Fragment } from "react";
import Head from "next/head";

const MeetupDetails = (props) => {
	return (
		<Fragment>
			<Head>
				<title>{props.meetupData.title}</title>
				<meta name="description" content="Details of meetup data" />
			</Head>
			<MeetupDetail
				image={props.meetupData.image}
				title={props.meetupData.title}
				description={props.meetupData.description}
				address={props.meetupData.address}
			/>
		</Fragment>
	);
};

export async function getStaticPaths() {
	const client = await MongoClient.connect(
		"mongodb+srv://rei-code:reinhard13@cluster0.pplhi.mongodb.net/meetups?retryWrites=true&w=majority"
	);

	const db = client.db();

	const meetupsCollection = db.collection("meetups");

	const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

	client.close();

	return {
		fallback: 'blocking',
		paths: meetups.map((meetup) => ({
			params: { meetupId: meetup._id.toString() },
		})),
	};
}

export const getStaticProps = async (context) => {
	const meetupId = context.params.meetupId;

	const client = await MongoClient.connect(
		"mongodb+srv://rei-code:reinhard13@cluster0.pplhi.mongodb.net/meetups?retryWrites=true&w=majority"
	);

	const db = client.db();

	const meetupsCollection = db.collection("meetups");

	const selectedMeetup = await meetupsCollection.findOne({
		_id: ObjectId(meetupId),
	});

	client.close();

	return {
		props: {
			meetupData: {
				title: selectedMeetup.title,
				description: selectedMeetup.description,
				address: selectedMeetup.address,
				image: selectedMeetup.image,
				id: selectedMeetup._id.toString(),
			},
		},
	};
};

export default MeetupDetails;
