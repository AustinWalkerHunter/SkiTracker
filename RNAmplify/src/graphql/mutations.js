/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
      id
      username
      image
      description
      createdAt
      updatedAt
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      id
      username
      image
      description
      createdAt
      updatedAt
    }
  }
`;
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
      id
      username
      image
      description
      createdAt
      updatedAt
    }
  }
`;
export const createCheckIn = /* GraphQL */ `
  mutation CreateCheckIn(
    $input: CreateCheckInInput!
    $condition: ModelCheckInConditionInput
  ) {
    createCheckIn(input: $input, condition: $condition) {
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
export const updateCheckIn = /* GraphQL */ `
  mutation UpdateCheckIn(
    $input: UpdateCheckInInput!
    $condition: ModelCheckInConditionInput
  ) {
    updateCheckIn(input: $input, condition: $condition) {
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
export const deleteCheckIn = /* GraphQL */ `
  mutation DeleteCheckIn(
    $input: DeleteCheckInInput!
    $condition: ModelCheckInConditionInput
  ) {
    deleteCheckIn(input: $input, condition: $condition) {
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
export const createComment = /* GraphQL */ `
  mutation CreateComment(
    $input: CreateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    createComment(input: $input, condition: $condition) {
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
export const updateComment = /* GraphQL */ `
  mutation UpdateComment(
    $input: UpdateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    updateComment(input: $input, condition: $condition) {
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
export const deleteComment = /* GraphQL */ `
  mutation DeleteComment(
    $input: DeleteCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    deleteComment(input: $input, condition: $condition) {
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
export const createLike = /* GraphQL */ `
  mutation CreateLike(
    $input: CreateLikeInput!
    $condition: ModelLikeConditionInput
  ) {
    createLike(input: $input, condition: $condition) {
      id
      userID
      checkInID
      createdAt
      updatedAt
    }
  }
`;
export const updateLike = /* GraphQL */ `
  mutation UpdateLike(
    $input: UpdateLikeInput!
    $condition: ModelLikeConditionInput
  ) {
    updateLike(input: $input, condition: $condition) {
      id
      userID
      checkInID
      createdAt
      updatedAt
    }
  }
`;
export const deleteLike = /* GraphQL */ `
  mutation DeleteLike(
    $input: DeleteLikeInput!
    $condition: ModelLikeConditionInput
  ) {
    deleteLike(input: $input, condition: $condition) {
      id
      userID
      checkInID
      createdAt
      updatedAt
    }
  }
`;
