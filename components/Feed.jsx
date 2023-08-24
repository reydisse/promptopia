"use client";

import { useState, useEffect } from "react";
import PromptCard from "./PromptCard";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className='mt-16 prompt_layout'>
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const [searchText, setSearchText] = useState("");
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);

  const filterPrompts = (searchText) => {
    const regex = new RegExp(searchText, "i");
    return posts.filter(
      (item) =>
        regex.test(item.creator.username) ||
        regex.test(item.tag) ||
        regex.test(item.prompt)
    );
  };

  const handleSearchChange = (e) => {
    const searchText = e.target.value;
    setSearchText(searchText);

    // Filter posts based on the search text
    const filtered = filterPrompts(searchText);
    setFilteredPosts(filtered);
  };

  const handleTagClick = (tag) => {
    setSearchText(tag); // Set the search bar text to the clicked tag
    const filtered = filterPrompts(tag);
    setFilteredPosts(filtered);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/prompt");
      const data = await response.json();
      setPosts(data);
      setFilteredPosts(data); // Initialize filtered posts with all posts
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    // Update filtered posts when posts or searchText change
    const filtered = filterPrompts(searchText);
    setFilteredPosts(filtered);
  }, [posts, searchText]);

  return (
    <section className='feed'>
      <form className='relative w-full flex-center'>
        <input
          type='text'
          placeholder='Search for a tag or a username'
          value={searchText}
          onChange={handleSearchChange}
          required
          className='search_input peer'
        />
      </form>

      {/* this piece of code displays all available tags right underneath the search bar. */}
      {/* <div className='tag-list'>
        {Array.from(new Set(posts.map((post) => post.tag))).map((tag) => (
          <span key={tag} className='tag' onClick={() => handleTagClick(tag)}>
          {tag}
          </span>
        ))}
      </div> */}

      <PromptCardList data={filteredPosts} handleTagClick={handleTagClick} />
    </section>
  );
};

export default Feed;
