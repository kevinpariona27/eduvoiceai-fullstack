using AutoMapper;
using EduVoiceAI.API.Models.Dto;
using EduVoiceAI.Domain.Entities;

namespace EduVoiceAI.API.Mapping;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // User <-> UserProfileDto
        CreateMap<User, UserProfileDto>()
            .ReverseMap();

        // TaskItem <-> TaskPlanDto
        CreateMap<TaskItem, TaskPlanDto>()
            .ReverseMap();

        // Event <-> EventReminderDto
        CreateMap<Event, EventReminderDto>()
            .ReverseMap();
    }
}
