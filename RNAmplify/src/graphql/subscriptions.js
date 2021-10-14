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
      type
      createdAt
      comments {
        nextToken
      }
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
      type
      createdAt
      comments {
        nextToken
      }
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
      type
      createdAt
      comments {
        nextToken
      }
      updatedAt
    }
  }
`;
export const onCreateComment = /* GraphQL */ `
  subscription OnCreateComment {
    onCreateComment {
      id
      checkInID
      checkIn {
        id
        title
        location
        sport
        image
        date
        likes
        userID
        type
        createdAt
        updatedAt
      }
      content
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateComment = /* GraphQL */ `
  subscription OnUpdateComment {
    onUpdateComment {
      id
      checkInID
      checkIn {
        id
        title
        location
        sport
        image
        date
        likes
        userID
        type
        createdAt
        updatedAt
      }
      content
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteComment = /* GraphQL */ `
  subscription OnDeleteComment {
    onDeleteComment {
      id
      checkInID
      checkIn {
        id
        title
        location
        sport
        image
        date
        likes
        userID
        type
        createdAt
        updatedAt
      }
      content
      createdAt
      updatedAt
    }
  }
`;
