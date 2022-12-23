import { GetStaticProps } from "next";
import React from "react";
import PortableText from "react-portable-text";
import { sanityClient, urlFor } from "../../sanity";
import { Post } from "../../typing";

interface Props {
  post: Post;
}

const SinglePost = ({ post }: Props) => {
  return (
    <main>
      <div>{post?.title}</div>
      <div>
        <img src={urlFor(post?.mainImage).url()} className="w-50 h-20" />
      </div>
      <div>{post?.description}</div>
      <div>{post?._createdAt}</div>
      <PortableText
        dataset={process.env.NEXT_PUBLIC_DATASET}
        projectId={process.env.NEXT_PUBLIC_PROJECT_ID}
        content={post?.body}
        serializers={{
          h1: (props: any) => {
            <h1 className="text-xl" {...props}></h1>;
          },
          link: (props: any) => {
            <h1 className="text-xl" {...props}></h1>;
          },
        }}
      />
    </main>
  );
};

export const getStaticPaths = async () => {
  const query = `
  *[_type == 'post']{
    _id,
    title, 
    slug {
      current
    }
}
    `;
  const fetchUrl = await sanityClient.fetch(query);
  const paths = fetchUrl.map((e: Post) => ({
    params: {
      slug: e?.slug?.current,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const query = `*[_type == 'post' && slug.current == $slug][0]{
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

    },
    body
  }`;
  const post = await sanityClient.fetch(query, {
    slug: context?.params?.slug,
  });

  if (!post) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      post,
    },
    revalidate: 60,
  };
};

export default SinglePost;
