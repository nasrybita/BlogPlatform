using System;

namespace BlogPlatform.Enums
{
    public enum Role
    {
        Admin, 
        Author,
        Subscriber
    }


    public enum PostStatus
    {
        Draft,
        Published
    }


    public enum CommentStatus
    {
        Approved, 
        Pending,
        Spam
    }

}
