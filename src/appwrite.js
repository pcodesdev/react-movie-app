import { Client, Databases, ID, Query } from "appwrite";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(PROJECT_ID);

const database = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
  try {
    const existingRecord = await database.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.equal("searchTerm", searchTerm)]
    );

    if (existingRecord.documents.length > 0) {
      const record = existingRecord.documents[0];
      const newCount = record.count + 1;

      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        record.$id,
        { count: newCount }
      );
    } else {
      await database.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        {
          searchTerm,
          count: 1,
          movie_id: movie.id,
          poster_url: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : null
        }
      );
    }
  } catch (error) {
    console.error("Error updating search count:", error);
  }
};


export const getTrendingMovies = async () => {
  try {
    const results = await database.listDocuments(
      DATABASE_ID,COLLECTION_ID,    [Query.orderDesc("count"), Query.limit(10)]);
    return results.documents;
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    throw error;
  }
};