/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      username
      image
      description
      createdAt
      updatedAt
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        username
        image
        description
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getCheckIn = /* GraphQL */ `
  query GetCheckIn($id: ID!) {
    getCheckIn(id: $id) {
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
export const listCheckIns = /* GraphQL */ `
  query ListCheckIns(
    $filter: ModelCheckInFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCheckIns(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getComment = /* GraphQL */ `
  query GetComment($id: ID!) {
    getComment(id: $id) {
      id
      userID
      checkInID
      content
      createdAt
      updatedAt
    }
  }
`;
export const listComments = /* GraphQL */ `
  query ListComments(
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listComments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userID
        checkInID
        content
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getLike = /* GraphQL */ `
  query GetLike($id: ID!) {
    getLike(id: $id) {
      id
      userID
      checkInID
      createdAt
      updatedAt
    }
  }
`;
export const listLikes = /* GraphQL */ `
  query ListLikes(
    $filter: ModelLikeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLikes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userID
        checkInID
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const checkInsByDate = /* GraphQL */ `
  query CheckInsByDate(
    $type: String
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelCheckInFilterInput
    $limit: Int
    $nextToken: String
  ) {
    checkInsByDate(
      type: $type
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
