using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using EduVoiceAI.Domain.Entities;

namespace EduVoiceAI.Domain.Contracts
{
    public interface IUnitOfWork : IDisposable
    {
        IGenericRepository<User> Users { get; }
        IGenericRepository<TaskItem> Tasks { get; }
        IGenericRepository<Event> Events { get; }

        Task<int> CommitAsync();
    }
}
