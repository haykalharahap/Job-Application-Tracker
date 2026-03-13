'use client';

import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import ApplicationCard from './ApplicationCard';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const columnMeta = {
  'Applied': { accent: 'col-applied', dot: 'bg-status-applied' },
  'Screening': { accent: 'col-screening', dot: 'bg-status-screening' },
  'Technical Test': { accent: 'col-technical', dot: 'bg-status-technical' },
  'Interview': { accent: 'col-interview', dot: 'bg-status-interview' },
  'Offer': { accent: 'col-offer', dot: 'bg-status-offer' },
  'Rejected': { accent: 'col-rejected', dot: 'bg-status-rejected' },
};

export default function KanbanBoard() {
  const { filteredApps, STATUSES, dispatch } = useApp();

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;
    
    dispatch({
      type: 'MOVE_APPLICATION',
      payload: { source, destination, draggableId }
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 auto-rows-min"
      >
        {STATUSES.map((status) => {
          const apps = filteredApps.filter((a) => a.status === status);
          const meta = columnMeta[status];

          return (
            <Droppable droppableId={status} key={status}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex flex-col rounded-2xl border-t-[3px] ${meta.accent} bg-surface-200/40 dark:bg-surface-900/40 min-h-[200px] ${
                    snapshot.isDraggingOver ? 'ring-2 ring-brand-500/30' : ''
                  }`}
                >
                  {/* Column header */}
                  <div className="flex items-center justify-between px-3.5 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${meta.dot}`} />
                      <span className="text-xs font-bold uppercase tracking-wider">{status}</span>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-surface-200 dark:bg-surface-800">
                      {apps.length}
                    </span>
                  </div>

                  {/* Cards */}
                  <div className="flex flex-col gap-2.5 px-2.5 pb-3 flex-1 h-full min-h-[150px]">
                    <AnimatePresence mode="popLayout">
                      {apps.map((app, index) => (
                        <Draggable key={app.id} draggableId={app.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...provided.draggableProps.style,
                                opacity: snapshot.isDragging ? 0.8 : 1,
                              }}
                              className="focus:outline-none"
                            >
                              <ApplicationCard app={app} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </AnimatePresence>

                    {apps.length === 0 && !snapshot.isDraggingOver && (
                      <div className="flex-1 flex items-center justify-center text-xs text-surface-700/40 dark:text-surface-300/30 min-h-[80px]">
                        Drop here
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Droppable>
          );
        })}
      </motion.div>
    </DragDropContext>
  );
}
