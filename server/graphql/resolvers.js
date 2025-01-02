import Course from '../models/Course.js';

export const resolvers = {
  Query: {
    courses: async () => {
      try {
        const courses = await Course.find().populate('instructor');
        return courses;
      } catch (error) {
        throw new Error('Error fetching courses');
      }
    },
    course: async (_, { id }) => {
      try {
        const course = await Course.findById(id).populate('instructor');
        if (!course) {
          throw new Error('Course not found');
        }
        return course;
      } catch (error) {
        throw new Error('Error fetching course');
      }
    },
    searchCourses: async (_, { searchTerm }) => {
      try {
        const regex = new RegExp(searchTerm, 'i');
        const courses = await Course.find({
          $or: [
            { title: { $regex: regex } },
            { description: { $regex: regex } }
          ]
        }).populate('instructor');
        return courses;
      } catch (error) {
        throw new Error('Error searching courses');
      }
    }
  }
};

export default resolvers;
