// This file is to be able to run several tests in cypress 10 at ones (they remove the 'run all spec' option)
import '../login.spec'

// Documents
import '../Documents/breadCrumb.spec'
import '../Documents/Deletion.spec'
import '../Documents/DocumentsInternDragNDrop.spec'
import '../Documents/DocumentsNavigation.spec'
import '../Documents/DocumentsSelection.spec'
import '../Documents/FileAndFolderCreation.spec'
import '../Documents/moveAndDuplicate.spec'
import '../Documents/rename.spec'

// Horaires
import '../Horaires/access.spec'
import '../Horaires/desktop.spec'
import '../Horaires/mobile.spec'

// HorairesHorsCadres
import '../HorairesHorsCadres/registration/depannage.spec'
import '../HorairesHorsCadres/registration/detention.spec'
import '../HorairesHorsCadres/registration/firing.spec'
import '../HorairesHorsCadres/registration/study.spec'
import '../HorairesHorsCadres/registration/replayTest.spec'
import '../HorairesHorsCadres/access.spec'
import '../HorairesHorsCadres/deregistrationOption.spec'
import '../HorairesHorsCadres/navigation.spec'
import '../HorairesHorsCadres/selectUser.spec'
import '../HorairesHorsCadres/slotCreation.spec'
import '../HorairesHorsCadres/slotDeletion.spec'
import '../HorairesHorsCadres/slotModification.spec'

// Progression
import '../Progression/ProgressionAffectation/homeworkAffectation.spec'
import '../Progression/ProgressionAffectation/sessionAffectation.spec'
import '../Progression/ProgressionEdit/DragAndDrop.spec'
import '../Progression/ProgressionEdit/ProgressionEmpty.spec'
import '../Progression/ProgressionEdit/ProgressionItem.spec'
import '../Progression/ProgressionEdit/ProgressionItemContent.spec'
import '../Progression/ProgressionEdit/ProgressionSection.spec'
import '../Progression/ProgressionEdit/ProgressionSubsection.spec'
import '../Progression/ProgressionList.spec'
