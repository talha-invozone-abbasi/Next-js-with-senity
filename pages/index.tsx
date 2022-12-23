import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Header from "../components/Header";

import { sanityClient, urlFor } from "../sanity";
import { Post } from "../typing";
interface Props {
  posts: [Post];
}

const Home = ({ posts }: Props) => {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Header />
        <div className="mx-auto flex max-w-7xl items-center bg-yellow-400 py-10">
          <div className="space-y-5 px-10">
            <h1 className="max-w-xl font-serif text-6xl">
              <span className="underline decoration-black decoration-4">
                Medium
              </span>{" "}
              is a place to write, read, and connect
            </h1>

            <h2>
              It`s easy and free to post your thinking on any topic and connect
              with millions of renders.
            </h2>
          </div>

          <img
            className="hidden h-32 md:inline-flex lg:h-full"
            src="https://accountabilitylab.org/wp-content/uploads/2020/03/Medium-logo.png"
            alt="medium-logo"
          />
        </div>
        {posts?.map((e, i) => (
          <Link href={`/posts/${e?.slug?.current}`} key={i}>
            <img
              src={urlFor(e?.mainImage).url()}
              alt={e?.author?.name}
              className="h-20 w-20"
            />
            <div>{e?.title}</div>
            <div>{e?.description}</div>
            <div className="flex">
              <div>{e?.author?.name}</div>
              <img
                src={urlFor(e?.mainImage).url()}
                alt={e?.author?.name}
                className="h-12 w-12 "
              />
            </div>
          </Link>
        ))}
      </main>
    </div>
  );
};

export const getServerSideProps = async () => {
  const query = `*[_type == 'post']{
    _id,
    title,
    _createdAt,
      description,
      slug,
      mainImage,
    publishedAt,
    author -> {
      name,
      image,
    }
  }`;
  const getPosts = await sanityClient.fetch(query);
  return {
    props: {
      posts: getPosts,
    },
  };
};

export default Home;
