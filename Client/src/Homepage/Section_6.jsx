import React from 'react'
import BlogContent from './BlogContent'
import './Section_6.css'


const Blog = () => {

        let blogPost = <div className = "section6">
                            {<h2>BLOG POSTS</h2>}
                            <div className = "blogPostWrapper">
                                {BlogContent.map(function(item){
                                    return (
                                        <div className = "blogPost">
                                            <img src = {item.ImagePath}/>
                                            <a href = {item.ItemLink}>{item.Title}</a>
                                            <p className = "date">{item.Date}</p>
                                            <p className = "content">{item.Content}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

        return (<React.Fragment>{blogPost}</React.Fragment>)

}


export default Blog