using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using EduVoiceAI.Domain.Contracts;
using EduVoiceAI.Domain.Entities;
using EduVoiceAI.Infrastructure.Persistence;

namespace EduVoiceAI.Infrastructure.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly EduVoiceDbContext _context;

        public IGenericRepository<User> Users { get; }
        public IGenericRepository<TaskItem> Tasks { get; }
        public IGenericRepository<Event> Events { get; }

        public UnitOfWork(EduVoiceDbContext context)
        {
            _context = context;
            Users = new GenericRepository<User>(_context);
            Tasks = new GenericRepository<TaskItem>(_context);
            Events = new GenericRepository<Event>(_context);
        }

        public async Task<int> CommitAsync() => await _context.SaveChangesAsync();

        public void Dispose() => _context.Dispose();
    }
}
