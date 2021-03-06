/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser {
    onCreateUser {
      id
      username
      image
      description
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser {
    onUpdateUser {
      id
      username
      image
      description
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser {
    onDeleteUser {
      id
      username
      image
      description
      createdAt
      updatedAt
    }
  }
`;
export const onCreateCheckIn = /* GraphQL */ `
  subscription OnCreateCheckIn {
    onCreateCheckIn {
      id
      title
      location
      sport
      image
      date
      likes
      userID
      userName
      type
      createdAt
      comments
      updatedAt
    }
  }
`;
export const onUpdateCheckIn = /* GraphQL */ `
  subscription OnUpdateCheckIn {
    onUpdateCheckIn {
      id
      title
      location
      sport
      image
      date
      likes
      userID
      userName
      type
      createdAt
      comments
      updatedAt
    }
  }
`;
export const onDeleteCheckIn = /* GraphQL */ `
  subscription OnDeleteCheckIn {
    onDeleteCheckIn {
      id
      title
      location
      sport
      image
      date
      likes
      userID
      userName
      type
      createdAt
      comments
      updatedAt
    }
  }
`;
export const onCreateComment = /* GraphQL */ `
  subscription OnCreateComment {
    onCreateComment {
      id
      userID
      checkInID
      content
      type
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateComment = /* GraphQL */ `
  subscription OnUpdateComment {
    onUpdateComment {
      id
      userID
      checkInID
      content
      type
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteComment = /* GraphQL */ `
  subscription OnDeleteComment {
    onDeleteComment {
      id
      userID
      checkInID
      content
      type
      createdAt
      updatedAt
    }
  }
`;
export const onCreateLike = /* GraphQL */ `
  subscription OnCreateLike {
    onCreateLike {
      id
      userID
      checkInID
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateLike = /* GraphQL */ `
  subscription OnUpdateLike {
    onUpdateLike {
      id
      userID
      checkInID
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteLike = /* GraphQL */ `
  subscription OnDeleteLike {
    onDeleteLike {
      id
      userID
      checkInID
      createdAt
      updatedAt
    }
  }
`;
export const onCreateFollowing = /* GraphQL */ `
  subscription OnCreateFollowing {
    onCreateFollowing {
      id
      userID
      followingID
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateFollowing = /* GraphQL */ `
  subscription OnUpdateFollowing {
    onUpdateFollowing {
      id
      userID
      followingID
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteFollowing = /* GraphQL */ `
  subscription OnDeleteFollowing {
    onDeleteFollowing {
      id
      userID
      followingID
      createdAt
      updatedAt
    }
  }
`;
